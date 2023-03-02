import { MantineProvider } from "@mantine/core";
import { type AppType } from "next/app";

import { api } from "@/utils/api";

import { SpotActions } from "@/features/common";
import { MainLayout } from "@/features/common/main-layout";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        /** Put your mantine theme override here */
        colorScheme: "light",
      }}
    >
      <SpotActions>
        <MainLayout>
          <Component {...pageProps} />
        </MainLayout>
      </SpotActions>
    </MantineProvider>
  );
};

export default api.withTRPC(MyApp);
