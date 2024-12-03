import Realm from 'realm';

export class ChatMessage extends Realm.Object<ChatMessage> {
  _id!: Realm.BSON.ObjectId;
  chatRoomId!: Realm.BSON.ObjectId;
  senderId!: Realm.BSON.ObjectId;
  message!: string;
  messageType!: 'text' | 'image' | 'system';
  sentAt!: Date;

  static schema: Realm.ObjectSchema = {
    name: 'ChatMessage',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      chatRoomId: 'objectId',
      senderId: 'objectId',
      message: 'string',
      messageType: 'string',
      sentAt: 'date',
    },
  };
}

export class ChatRoom extends Realm.Object<ChatRoom> {
  _id!: Realm.BSON.ObjectId;
  tripRequestId?: Realm.BSON.ObjectId;
  fixedRouteId?: Realm.BSON.ObjectId;
  customerId!: Realm.BSON.ObjectId;
  driverId!: Realm.BSON.ObjectId;
  status!: 'active' | 'pending' | 'closed';
  createdAt!: Date;
  updatedAt!: Date;

  static schema: Realm.ObjectSchema = {
    name: 'ChatRoom',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      tripRequestId: 'objectId?',
      fixedRouteId: 'objectId?',
      customerId: 'objectId',
      driverId: 'objectId',
      status: 'string',
      createdAt: 'date',
      updatedAt: 'date',
    },
  };
}

export class FixedRoute extends Realm.Object<FixedRoute> {
  _id!: Realm.BSON.ObjectId;
  driverId!: Realm.BSON.ObjectId;
  startLocation!: string;
  endLocation!: string;
  departureTime!: Date;
  totalSeats!: number;
  availableSeats!: number;
  price!: number;
  createdAt!: Date;

  static schema: Realm.ObjectSchema = {
    name: 'FixedRoute',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      driverId: 'objectId',
      startLocation: 'string',
      endLocation: 'string',
      departureTime: 'date',
      totalSeats: 'int',
      availableSeats: 'int',
      price: 'float',
      createdAt: 'date',
    },
  };
}

export class Rating extends Realm.Object<Rating> {
  _id!: Realm.BSON.ObjectId;
  driverId!: Realm.BSON.ObjectId;
  customerId!: Realm.BSON.ObjectId;
  tripId!: Realm.BSON.ObjectId;
  rating!: number;
  comment?: string;
  createdAt!: Date;

  static schema: Realm.ObjectSchema = {
    name: 'Rating',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      driverId: 'objectId',
      customerId: 'objectId',
      tripId: 'objectId',
      rating: 'int',
      comment: 'string?',
      createdAt: 'date',
    },
  };
}

export class TripRequest extends Realm.Object<TripRequest> {
  _id!: Realm.BSON.ObjectId;
  customerId!: Realm.BSON.ObjectId;
  startLocation!: string;
  endLocation!: string;
  departureTime!: Date;
  status!: 'pending' | 'accepted' | 'rejected' | 'cancelled';
  requestTime!: Date;
  updatedAt!: Date;

  static schema: Realm.ObjectSchema = {
    name: 'TripRequest',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      customerId: 'objectId',
      startLocation: 'string',
      endLocation: 'string',
      departureTime: 'date',
      status: 'string',
      requestTime: 'date',
      updatedAt: 'date',
    },
  };
}

export class TripRequestForFixedRoute extends Realm.Object<TripRequestForFixedRoute> {
  _id!: Realm.BSON.ObjectId;
  fixedRouteId!: Realm.BSON.ObjectId;
  customerId!: Realm.BSON.ObjectId;
  requestType!: 'join' | 'cancel';
  status!: 'pending' | 'accepted' | 'rejected' | 'cancelled';
  requestTime!: Date;
  updatedAt!: Date;

  static schema: Realm.ObjectSchema = {
    name: 'TripRequestForFixedRoute',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      fixedRouteId: 'objectId',
      customerId: 'objectId',
      requestType: 'string',
      status: 'string',
      requestTime: 'date',
      updatedAt: 'date',
    },
  };
}

export class User extends Realm.Object<User> {
  _id!: Realm.BSON.ObjectId;
  name!: string;
  phone!: string;
  email?: string;
  role!: 'customer' | 'driver';
  vehicleId?: Realm.BSON.ObjectId;
  totalRatings?: number;
  averageRating?: number;
  createdAt!: Date;

  static schema: Realm.ObjectSchema = {
    name: 'User',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      name: 'string',
      phone: 'string',
      email: 'string?',
      role: 'string',
      vehicleId: 'objectId?',
      totalRatings: 'int?',
      averageRating: 'float?',
      createdAt: 'date',
    },
  };
}

export class Vehicle extends Realm.Object<Vehicle> {
  _id!: Realm.BSON.ObjectId;
  driverId!: Realm.BSON.ObjectId;
  licensePlate!: string;
  model!: string;
  color?: string;
  capacity!: number;
  createdAt!: Date;

  static schema: Realm.ObjectSchema = {
    name: 'Vehicle',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      driverId: 'objectId',
      licensePlate: 'string',
      model: 'string',
      color: 'string?',
      capacity: 'int',
      createdAt: 'date',
    },
  };
}

export const realmConfig: Realm.Configuration = {
  schema: [ChatMessage, ChatRoom, FixedRoute, Rating, TripRequest, TripRequestForFixedRoute, User, Vehicle],
};

