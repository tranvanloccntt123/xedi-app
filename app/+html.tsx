import React from "react";
import { ScrollViewStyleReset } from "expo-router/html";
import { type PropsWithChildren } from "react";

/**
 * This file is web-only and used to configure the root HTML for every web page during static rendering.
 * The contents of this function only run in Node.js environments and do not have access to the DOM or browser APIs.
 */
export default function Root({ children }: PropsWithChildren) {
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1, shrink-to-fit=no"
                />
                {/*
          Disable body scrolling on web. This makes ScrollView components work closer to how they do on native.
          However, body scrolling is often nice to have for mobile web. If you want to enable it, remove this line.
        */}
                <ScrollViewStyleReset />

                {/* Using raw CSS styles as an escape-hatch to ensure the background color never flickers in dark-mode. */}
                <style dangerouslySetInnerHTML={{ __html: responsiveBackground }} />
                {/* Add any additional <head> elements that you want globally available on web... */}
            </head>
            <body>{children}</body>
        </html>
    );
}

const responsiveBackground = `
body {
  background-color: #fff;
}

@font-face {
  src: url(node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Ionicons.ttf);
  font-family: "Ionicons";
}

@font-face {
  src: url(node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/AntDesign.ttf);
  font-family: "AntDesign";
}

@font-face {
  src: url(node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Entypo.ttf);
  font-family: "Entypo";
}

@font-face {
  src: url(node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Fontisto.ttf);
  font-family: "Fontisto";
}

@font-face {
  src: url(node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Foundation.ttf);
  font-family: "Foundation";
}


@font-face {
  src: url(node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/MaterialIcons.ttf);
  font-family: "MaterialIcons";
}

@font-face {
  src: url(node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Octicons.ttf);
  font-family: "Octicons";
}

@font-face {
  src: url(node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/SimpleLineIcons.ttf);
  font-family: "SimpleLineIcons";
}

@font-face {
  src: url(node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Zocial.ttf);
  font-family: "Zocial";
}


@font-face {
  src: url(node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Feather.ttf);
  font-family: "Feather";
}


@font-face {
  src: url(node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/FontAwesome.ttf);
  font-family: "FontAwesome";
}

@font-face {
  src: url(node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/FontAwesome5_Brands.ttf);
  font-family: "FontAwesome5_Brands";
  font-weight: 400;
  /* Regular weight */
  font-style: normal;
}

@font-face {
  src: url(node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/FontAwesome5_Regular.ttf);
  font-family: "FontAwesome5_Regular";
  font-weight: 400;
  /* Regular weight */
  font-style: normal;
}

@font-face {
  src: url(node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/FontAwesome5_Solid.ttf);
  font-family: "FontAwesome5_Solid";
  font-weight: 900;
  /* Bold weight for solid */
  font-style: normal;
}

@font-face {
  src: url(node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/MaterialIcons.ttf);
  font-family: "MaterialIcons";
}

@font-face {
  src: url(node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Feather.ttf);
  font-family: "Feather";
}

@font-face {
  src: url(node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/MaterialCommunityIcons.ttf);
  font-family: "MaterialCommunityIcons";
}
@media (prefers-color-scheme: dark) {
  body {
    background-color: #000;
  }
}`;
