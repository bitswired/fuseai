import {
  ColorSchemeProvider,
  MantineProvider,
  type ColorScheme,
} from "@mantine/core";
import { type AppType } from "next/app";

import { api } from "@/utils/api";

import { SpotActions } from "@/features/common";
import { MainLayout } from "@/features/common/main-layout";
import { useState } from "react";

const MyApp: AppType = ({ Component, pageProps }) => {
  const [colorScheme, setColorScheme] = useState<ColorScheme>("light");
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));
  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          globalStyles: (theme) => ({
            // html: {
            //   width: "100%",
            //   overflowX: "hidden",
            // },
            // body: {
            //   width: "100%",
            //   overflowX: "hidden",
            // },
          }),

          primaryColor: "orange",

          /** Put your mantine theme override here */
          colorScheme,
        }}
      >
        <SpotActions>
          <MainLayout>
            <Component {...pageProps} />
          </MainLayout>
        </SpotActions>
      </MantineProvider>
    </ColorSchemeProvider>
  );
};

export default api.withTRPC(MyApp);
