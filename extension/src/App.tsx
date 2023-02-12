import { ReactNode, useEffect, useState } from "react";
import Reddit from "./images/reddit-logo.png";
import YouTube from "./images/youtube-logo.png";
import Home from "./images/home.svg";
import Search from "./images/search.svg";
import Bookmark from "./images/bookmark.svg";
import Logo from "./images/logo.png";

function App() {
  /*
   * 1: Results
   * 2: Search
   * 3: Saved
   */
  const [page, setPage] = useState<number>(1);
  const [productName, setProductName] = useState<string>("");

  // try to find the product name in the current page
  useEffect(() => {
    if (page === 1) {
      // Check product
    }
    // Amazon

    // other sites...
  }, [page]);

  const renderBody = (): ReactNode => {
    if (page === 1 && productName === "") {
      return (
        <>
          <p style={{ fontSize: "1.25em", textAlign: "center" }}>
            Visit a product page or perform a manual search to get started!
          </p>
          <img
            style={{ width: "200px", height: "200px" }}
            src={Logo}
            alt="watermelon logo"
          />
        </>
      );
    }

    return (
      <>
        <p style={{ fontSize: "1.25em", textAlign: "center" }}>
          Something went wrong!
        </p>
      </>
    );
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        paddingBottom: "80px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          height: "70px",
          paddingLeft: "20px",
          width: "100%",
        }}
      >
        <h1 style={{ fontWeight: 500, fontSize: "1.5em" }}>🍉 watermelon</h1>
      </div>
      <div
        style={{
          height: "400px",
          width: "360px",
          overflow: "scroll",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          paddingLeft: "20px",
          paddingRight: "20px",
        }}
      >
        {renderBody()}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          position: "fixed",
          bottom: 0,
          width: "100%",
          height: "80px",
          alignItems: "center",
          justifyContent: "space-evenly",
        }}
      >
        <div
          className="bottom-nav-button"
          onClick={() => setPage(1)}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "75%",
            width: "25%",
            borderRadius: "15px",
          }}
        >
          <img style={{ height: "48px" }} src={Home} alt="Home" />
        </div>
        <div
          className="bottom-nav-button"
          onClick={() => setPage(2)}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "75%",
            width: "25%",
            borderRadius: "15px",
          }}
        >
          <img style={{ height: "48px" }} src={Search} alt="Search" />
        </div>
        <div
          className="bottom-nav-button"
          onClick={() => setPage(3)}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "75%",
            width: "25%",
            borderRadius: "15px",
          }}
        >
          <img style={{ height: "48px" }} src={Bookmark} alt="Bookmark" />
        </div>
      </div>
    </div>
  );
}

export default App;
