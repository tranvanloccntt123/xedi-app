-- SQL Schema based on index.d.ts for Supabase (PostgreSQL)

-- Drop existing types and tables if they exist (optional, for clean slate)
-- Use with caution in production!
/*
DROP TABLE IF EXISTS feed_media CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS chat_messages CASCADE;
DROP TABLE IF EXISTS chat_rooms CASCADE;
DROP TABLE IF EXISTS ratings CASCADE;
DROP TABLE IF EXISTS driver_trip_requests CASCADE; -- Renamed from IDriverTripRequest
DROP TABLE IF EXISTS fixed_route_orders CASCADE;
DROP TABLE IF EXISTS trip_requests CASCADE;
DROP TABLE IF EXISTS fixed_routes CASCADE;
DROP TABLE IF EXISTS feed CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS user_coins CASCADE;
DROP TABLE IF EXISTS users_location_store CASCADE; -- Renamed from IUserLocationStore
DROP TABLE IF EXISTS vehicles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

DROP TYPE IF EXISTS user_role;
DROP TYPE IF EXISTS trip_type;
DROP TYPE IF EXISTS chat_room_status;
DROP TYPE IF EXISTS message_type;
DROP TYPE IF EXISTS feed_content_type;
*/

-- ----------------------------------------
-- ENUM Types
-- ----------------------------------------

CREATE TYPE user_role AS ENUM ('customer', 'driver');
CREATE TYPE trip_type AS ENUM ('Delivery', 'Taxi');
CREATE TYPE chat_room_status AS ENUM ('active', 'pending', 'closed');
CREATE TYPE message_type AS ENUM ('text', 'image', 'system');
CREATE TYPE feed_content_type AS ENUM ('image', 'video');

-- ----------------------------------------
-- Tables
-- ----------------------------------------

-- Users Table (Corresponds to IUser)
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text UNIQUE NOT NULL,
  email text UNIQUE,
  role user_role NOT NULL,
  vehicle_id uuid, -- Foreign key added later after vehicles table creation
  total_ratings integer DEFAULT 0, -- Likely calculated/updated via triggers or functions
  average_rating numeric(3, 2) DEFAULT 0.0, -- Precision 3, Scale 2 (e.g., 4.75), likely calculated
  created_at timestamptz DEFAULT now(),
  avatar text NULL,
  password text -- IMPORTANT: Store securely hashed passwords, not plain text!
);
COMMENT ON COLUMN users.password IS 'Stores the securely hashed password.';
COMMENT ON COLUMN users.total_ratings IS 'Cached total number of ratings received.';
COMMENT ON COLUMN users.average_rating IS 'Cached average rating.';

-- Vehicles Table (Corresponds to IVehicle)
CREATE TABLE vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- Driver owning this vehicle
  license_plate text UNIQUE NOT NULL,
  model text NOT NULL,
  color text,
  capacity integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now()
);
COMMENT ON COLUMN vehicles.driver_id IS 'The driver associated with this vehicle.';

-- Add the foreign key constraint from users to vehicles now that vehicles table exists
ALTER TABLE users
ADD CONSTRAINT fk_users_vehicle_id
FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE SET NULL;
COMMENT ON COLUMN users.vehicle_id IS 'Foreign key referencing the vehicle associated with a driver.';


-- Fixed Routes Table (Corresponds to IFixedRoute) - USING JSONB FOR LOCATION
CREATE TABLE fixed_routes (
  id serial PRIMARY KEY, -- Using serial as ID is number
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- The user (driver) who created the route
  start_location jsonb NOT NULL, -- Changed to jsonb
  end_location jsonb NOT NULL,   -- Changed to jsonb
  departure_time timestamptz NOT NULL, -- Changed from string to timestamptz
  total_seats integer NOT NULL,
  available_seats integer NOT NULL, -- Should be managed (e.g., >= 0 and <= total_seats)
  price numeric NOT NULL CHECK (price >= 0),
  created_at timestamptz DEFAULT now(),
  status integer NOT NULL DEFAULT 0 -- Consider using text or enum for clarity (e.g., 0: active, 1: full, 2: departed, 3: cancelled)
);
COMMENT ON COLUMN fixed_routes.user_id IS 'The driver who created this fixed route.';
COMMENT ON COLUMN fixed_routes.start_location IS 'Stores start location details (display_name, lat, lon) as JSONB.';
COMMENT ON COLUMN fixed_routes.end_location IS 'Stores end location details (display_name, lat, lon) as JSONB.';
COMMENT ON COLUMN fixed_routes.available_seats IS 'Number of currently available seats. Needs careful management.';
COMMENT ON COLUMN fixed_routes.status IS 'Status of the fixed route (e.g., 0: active, 1: full, 2: departed, 3: cancelled).';

alter table fixed_routes
add column feed_id integer default null,
add constraint fk_feed_fixed_route_id foreign key (feed_id) references feed(id);

-- Trip Requests Table (Corresponds to ITripRequest) - USING JSONB FOR LOCATION
CREATE TABLE trip_requests (
  id serial PRIMARY KEY, -- Using serial as ID is number
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- The customer who made the request
  start_location jsonb NOT NULL, -- Changed to jsonb
  end_location jsonb NOT NULL,   -- Changed to jsonb
  departure_time timestamptz NOT NULL,
  status integer NOT NULL DEFAULT 0, -- Consider using text or enum for clarity (e.g., 0: pending, 1: accepted, 2: driver_assigned, 3: in_progress, 4: completed, 5: cancelled)
  type trip_type NOT NULL,
  created_at timestamptz DEFAULT now(), -- Changed from string to timestamptz
  fixed_route_id integer REFERENCES fixed_routes(id) ON DELETE SET NULL -- Optional link to a fixed route
);
COMMENT ON COLUMN trip_requests.user_id IS 'The customer who created the trip request.';
COMMENT ON COLUMN trip_requests.start_location IS 'Stores start location details (display_name, lat, lon) as JSONB.';
COMMENT ON COLUMN trip_requests.end_location IS 'Stores end location details (display_name, lat, lon) as JSONB.';
COMMENT ON COLUMN trip_requests.status IS 'Status of the trip request (e.g., 0: pending, 1: accepted, 2: driver_assigned, 3: in_progress, 4: completed, 5: cancelled).';
COMMENT ON COLUMN trip_requests.fixed_route_id IS 'Optional link to a fixed route this request might be related to.';

alter table trip_requests
add column feed_id integer default null,
add constraint fk_feed_trip_request_id foreign key (feed_id) references feed(id);


-- Driver Trip Offers/Assignments Table (Corresponds to IDriverTripRequest)
CREATE TABLE driver_trip_requests (
  id serial PRIMARY KEY, -- Using serial as ID is number
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- The driver making the offer/assigned
  trip_request_id integer NOT NULL REFERENCES trip_requests(id) ON DELETE CASCADE, -- The trip request being offered/assigned
  price numeric NOT NULL CHECK (price >= 0), -- The price offered by the driver (if applicable)
  status integer NOT NULL DEFAULT 0, -- Status of the offer/assignment (e.g., 0: offered, 1: accepted_by_customer, 2: rejected, 3: assigned)
  created_at timestamptz DEFAULT now()
);
COMMENT ON COLUMN driver_trip_requests.user_id IS 'The driver making the offer or assigned to the trip.';
COMMENT ON COLUMN driver_trip_requests.trip_request_id IS 'The trip request this offer pertains to.';
COMMENT ON COLUMN driver_trip_requests.status IS 'Status of the offer/assignment (e.g., 0: offered, 1: accepted_by_customer, 2: rejected, 3: assigned).';


-- Ratings Table (Corresponds to IRating)
CREATE TABLE ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- The driver being rated
  customer_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- The customer giving the rating
  trip_request_id integer NOT NULL REFERENCES trip_requests(id) ON DELETE CASCADE, -- Assuming tripId refers to trip_request_id
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5), -- Assuming a 1-5 star rating
  comment text,
  created_at timestamptz DEFAULT now(),
  UNIQUE (driver_id, customer_id, trip_request_id) -- Ensure a customer rates a specific trip for a driver only once
);
COMMENT ON COLUMN ratings.driver_id IS 'The driver being rated.';
COMMENT ON COLUMN ratings.customer_id IS 'The customer giving the rating.';
COMMENT ON COLUMN ratings.trip_request_id IS 'The specific trip being rated.';


-- Chat Rooms Table (Corresponds to IChatRoom)
CREATE TABLE chat_rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_request_id integer REFERENCES trip_requests(id) ON DELETE SET NULL, -- Link to trip request
  fixed_route_id integer REFERENCES fixed_routes(id) ON DELETE SET NULL, -- Link to fixed route
  customer_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  driver_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status chat_room_status NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(), -- Consider a trigger to auto-update this
  CONSTRAINT check_chat_room_context CHECK (trip_request_id IS NOT NULL OR fixed_route_id IS NOT NULL) -- Ensure room has context
);
COMMENT ON COLUMN chat_rooms.updated_at IS 'Timestamp of the last message or status change. Consider using a trigger.';
COMMENT ON CONSTRAINT check_chat_room_context ON chat_rooms IS 'Ensures a chat room is linked to either a trip request or a fixed route.';


-- Chat Messages Table (Corresponds to IChatMessage)
CREATE TABLE chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_room_id uuid NOT NULL REFERENCES chat_rooms(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- User who sent the message
  message text NOT NULL,
  message_type message_type NOT NULL DEFAULT 'text',
  sent_at timestamptz DEFAULT now()
);
COMMENT ON COLUMN chat_messages.sender_id IS 'The user (customer or driver) who sent the message.';


-- News Feed Items Table (Corresponds to INewsFeedItem)
-- Note: fixed_routes, trip_requests arrays in the interface are complex.
-- This table primarily stores the feed content and links to the author.
-- Comments and Media will link *to* this table.
CREATE TABLE feed (
  id serial PRIMARY KEY, -- Using serial as ID is number
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- The user who created the feed item (author)
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
  -- Association with fixed_routes/trip_requests might need a separate join table
  -- or be handled contextually if a feed item *describes* a route/trip.
  -- The comment count [{ count: number }] is likely a derived value, not stored directly.
);
COMMENT ON COLUMN feed.user_id IS 'The user who created the feed item.';

-- Profiles Table
CREATE TABLE profiles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    fcm_token text NOT NULL
);

-- Comments Table (Corresponds to IComment)
CREATE TABLE comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- The user who wrote the comment
  feed_id integer REFERENCES feed(id) ON DELETE CASCADE, -- Link to the feed item being commented on
  parent_id uuid REFERENCES comments(id) ON DELETE CASCADE, -- For threaded comments (replying to another comment)
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT check_comment_context CHECK (feed_id IS NOT NULL OR parent_id IS NOT NULL) -- Must be linked to feed or parent
);
COMMENT ON COLUMN comments.user_id IS 'The user who wrote the comment.';
COMMENT ON COLUMN comments.feed_id IS 'The news feed item this comment belongs to (if top-level).';
COMMENT ON COLUMN comments.parent_id IS 'The parent comment this comment is replying to (if threaded).';


-- Feed Media Table (Corresponds to IFeedMedia)
CREATE TABLE feed_media (
  id serial PRIMARY KEY, -- Using serial as ID is number
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- User who uploaded the media
  feed_id integer NOT NULL REFERENCES feed(id) ON DELETE CASCADE, -- Feed item this media belongs to
  path text NOT NULL, -- Path to the media file (e.g., in Supabase Storage)
  content_type feed_content_type NOT NULL,
  created_at timestamptz DEFAULT now() -- Changed from string to timestamptz
);
COMMENT ON COLUMN feed_media.user_id IS 'The user who uploaded the media.';
COMMENT ON COLUMN feed_media.feed_id IS 'The news feed item this media is attached to.';
COMMENT ON COLUMN feed_media.path IS 'Path or URL to the media file, likely in object storage.';


-- Fixed Route Orders Table (Corresponds to IFixedRouteOrder) - USING JSONB FOR LOCATION
CREATE TABLE fixed_route_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fixed_route_id integer NOT NULL REFERENCES fixed_routes(id) ON DELETE CASCADE, -- The route being booked
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- The user making the booking
  name text NOT NULL, -- Name provided at booking time
  phone_number text NOT NULL, -- Phone provided at booking time
  note text,
  location jsonb NOT NULL, -- Changed to jsonb (Pickup/Dropoff location for this specific order)
  status integer NOT NULL DEFAULT 0, -- Status of the order (e.g., 0: pending, 1: confirmed, 2: completed, 3: cancelled)
  created_at timestamptz DEFAULT now()
);
COMMENT ON COLUMN fixed_route_orders.fixed_route_id IS 'The fixed route this order is for.';
COMMENT ON COLUMN fixed_route_orders.user_id IS 'The user who placed the order.';
COMMENT ON COLUMN fixed_route_orders.location IS 'Stores pickup/dropoff location details (display_name, lat, lon) for this order as JSONB.';
COMMENT ON COLUMN fixed_route_orders.status IS 'Status of the order (e.g., 0: pending, 1: confirmed, 2: completed, 3: cancelled).';


-- Notifications Table (Corresponds to INotification)
CREATE TABLE notifications (
  id serial PRIMARY KEY, -- Using serial as ID is number
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- The user this notification is for
  body text NOT NULL,
  created_at timestamptz DEFAULT now(), -- Changed from string to timestamptz
  read_at timestamptz -- Timestamp when the notification was marked as read
);
COMMENT ON COLUMN notifications.user_id IS 'The user who should receive this notification.';
COMMENT ON COLUMN notifications.read_at IS 'Timestamp when the user marked the notification as read.';


-- User Coins Table (Corresponds to IUserCoin)
CREATE TABLE user_coins (
  id serial PRIMARY KEY, -- Using serial as ID is number
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  coins integer NOT NULL DEFAULT 0 CHECK (coins >= 0),
  created_at timestamptz DEFAULT now(), -- Changed from string to timestamptz
  -- Consider adding a 'transaction_type' or 'reason' column
  -- Also, maybe make user_id unique if it's a balance table, or add updated_at if it's a transaction log
  UNIQUE (user_id) -- Assuming this table stores the *current* coin balance per user
);
COMMENT ON COLUMN user_coins.coins IS 'Current coin balance for the user.';
COMMENT ON CONSTRAINT user_coins_user_id_key ON user_coins IS 'Ensures only one coin balance entry per user.';


-- User Location History Table (Corresponds to IUserLocationStore) - USING JSONB FOR LOCATION
CREATE TABLE users_location_store (
  id serial PRIMARY KEY, -- Using serial as ID is number
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  location jsonb NOT NULL, -- Changed to jsonb
  created_at timestamptz DEFAULT now() -- Changed from string to timestamptz, represents time of location capture
);

COMMENT ON TABLE users_location_store IS 'Stores historical location data for users.';
COMMENT ON COLUMN users_location_store.location IS 'Stores location details (display_name, lat, lon) as JSONB.';
COMMENT ON COLUMN users_location_store.created_at IS 'Timestamp when the location was recorded.';


-- ----------------------------------------
-- Indexes (Example - Add more as needed based on query patterns)
-- ----------------------------------------

-- Users
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_email ON users(email);

-- Vehicles
CREATE INDEX idx_vehicles_driver_id ON vehicles(driver_id);

-- Fixed Routes
CREATE INDEX idx_fixed_routes_user_id ON fixed_routes(user_id);
CREATE INDEX idx_fixed_routes_departure_time ON fixed_routes(departure_time);
CREATE INDEX idx_fixed_routes_status ON fixed_routes(status);
-- Optional GIN indexes for JSONB location columns
-- CREATE INDEX idx_fixed_routes_start_location_gin ON fixed_routes USING GIN (start_location);
-- CREATE INDEX idx_fixed_routes_end_location_gin ON fixed_routes USING GIN (end_location);


-- Trip Requests
CREATE INDEX idx_trip_requests_user_id ON trip_requests(user_id);
CREATE INDEX idx_trip_requests_status ON trip_requests(status);
CREATE INDEX idx_trip_requests_departure_time ON trip_requests(departure_time);
CREATE INDEX idx_trip_requests_fixed_route_id ON trip_requests(fixed_route_id);
-- Optional GIN indexes for JSONB location columns
-- CREATE INDEX idx_trip_requests_start_location_gin ON trip_requests USING GIN (start_location);
-- CREATE INDEX idx_trip_requests_end_location_gin ON trip_requests USING GIN (end_location);


-- Driver Trip Offers
CREATE INDEX idx_driver_trip_requests_user_id ON driver_trip_requests(user_id);
CREATE INDEX idx_driver_trip_requests_trip_request_id ON driver_trip_requests(trip_request_id);

-- Ratings
CREATE INDEX idx_ratings_driver_id ON ratings(driver_id);
CREATE INDEX idx_ratings_customer_id ON ratings(customer_id);
CREATE INDEX idx_ratings_trip_request_id ON ratings(trip_request_id);

-- Chat Rooms
CREATE INDEX idx_chat_rooms_customer_id ON chat_rooms(customer_id);
CREATE INDEX idx_chat_rooms_driver_id ON chat_rooms(driver_id);
CREATE INDEX idx_chat_rooms_trip_request_id ON chat_rooms(trip_request_id);
CREATE INDEX idx_chat_rooms_fixed_route_id ON chat_rooms(fixed_route_id);

-- Chat Messages
CREATE INDEX idx_chat_messages_chat_room_id_sent_at ON chat_messages(chat_room_id, sent_at DESC); -- Crucial for fetching messages
CREATE INDEX idx_chat_messages_sender_id ON chat_messages(sender_id);

-- News Feed Items
CREATE INDEX idx_feed_user_id ON feed(user_id);
CREATE INDEX idx_feed_created_at ON feed(created_at DESC);

-- Comments
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_comments_feed_id ON comments(feed_id);
CREATE INDEX idx_comments_parent_id ON comments(parent_id);

-- Feed Media
CREATE INDEX idx_feed_media_user_id ON feed_media(user_id);
CREATE INDEX idx_feed_media_feed_id ON feed_media(feed_id);

-- Fixed Route Orders
CREATE INDEX idx_fixed_route_orders_fixed_route_id ON fixed_route_orders(fixed_route_id);
CREATE INDEX idx_fixed_route_orders_user_id ON fixed_route_orders(user_id);
CREATE INDEX idx_fixed_route_orders_status ON fixed_route_orders(status);
-- Optional GIN index for JSONB location column
-- CREATE INDEX idx_fixed_route_orders_location_gin ON fixed_route_orders USING GIN (location);


-- Notifications
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX idx_notifications_read_at ON notifications(read_at);

-- User Locations
CREATE INDEX idx_users_location_store_user_id_created_at ON users_location_store(user_id, created_at DESC); -- For fetching user history
-- Optional GIN index for JSONB location column
-- CREATE INDEX idx_users_location_store_location_gin ON users_location_store USING GIN (location);


-- ----------------------------------------
-- RLS Policies (Placeholder - Enable RLS and define policies in Supabase UI or separate script)
-- ----------------------------------------
-- Example: Enable RLS for a table (DO THIS FOR ALL TABLES ACCESSED BY CLIENTS)
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- Example Policy: Allow users to see their own profile
-- CREATE POLICY "Allow individual user access" ON users FOR SELECT USING (auth.uid() = id);
-- Example Policy: Allow users to update their own profile
-- CREATE POLICY "Allow individual user update" ON users FOR UPDATE USING (auth.uid() = id);

-- Remember to enable RLS and define appropriate policies for ALL tables
-- that will be accessed directly from the client-side application.
-- Policies should restrict users to only access/modify data they own or are permitted to see/change.

