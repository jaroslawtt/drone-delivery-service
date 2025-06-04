import { Sidebar } from "./components/sidebar/sidebar";
import { OrderMenu } from "./components/order-menu/order-menu";

const MainPage = () => {
  return (
    <main>
      <Sidebar />
      <OrderMenu />
    </main>
  );
};

export { MainPage };
