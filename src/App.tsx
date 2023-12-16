import "./App.css";
import { FullCarousel, FullCarousel2 } from "./components/Carousel/Carousel";
import { Tab, TabItem } from "./components/Tab/Tab";

function App() {
  return (
    <>
      <Tab labels={["Tab 1", "Tab 2", "Tab 3"]}>
        <TabItem>
          <FullCarousel />
        </TabItem>
        {/* <TabItem>
          <FullCarousel />
        </TabItem> */}
        <TabItem>
          <FullCarousel2 />
        </TabItem>
      </Tab>
    </>
  );
}

export default App;
