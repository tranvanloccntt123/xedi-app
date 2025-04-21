FROM node:20

# # Install OpenJDK 11
# RUN apt-get update && apt-get install -y \
#     openjdk-11-jdk \
#     unzip \
#     && rm -rf /var/lib/apt/lists/*

# # Install Android SDK
# ENV ANDROID_HOME=/opt/android-sdk
# ENV PATH=${PATH}:${ANDROID_HOME}/cmdline-tools/latest/bin:${ANDROID_HOME}/platform-tools

# RUN mkdir -p ${ANDROID_HOME}/cmdline-tools && \
#     wget -q https://dl.google.com/android/repository/commandlinetools-linux-8512546_latest.zip -O /tmp/cmdline-tools.zip && \
#     unzip /tmp/cmdline-tools.zip -d ${ANDROID_HOME}/cmdline-tools && \
#     mv ${ANDROID_HOME}/cmdline-tools/cmdline-tools ${ANDROID_HOME}/cmdline-tools/latest && \
#     rm /tmp/cmdline-tools.zip

# # Accept Android SDK licenses and install required SDK components
# RUN yes | sdkmanager --licenses && \
#     sdkmanager "platform-tools" "platforms;android-30" "build-tools;30.0.3"

# Choose workdir
WORKDIR /app
# Install dependencies
COPY . .
RUN yarn install

RUN yarn cache clean

# Clean build folder
RUN cd apps/mobile && npx expo prebuild
CMD ["npx", "expo", "run:android"]