import { useEffect } from "react";

function useTabbar() {
  useEffect(() => {
    function hideTabbar() {
      var tabbar = document.getElementById(`appTabBar`);
      if (tabbar) tabbar.style.bottom = "-60px";
      var fabbtn = document.getElementById(`appFabBtn`);
      if (fabbtn) {
        fabbtn.style.height = "0px";
        fabbtn.style.width = "0px";
      }
    }

    hideTabbar();

    return function showTabbar() {
      var tabbar = document.getElementById(`appTabBar`);
      if (tabbar) tabbar.style.bottom = "0";
      var fabbtn = document.getElementById(`appFabBtn`);
      if (fabbtn) {
        fabbtn.style.height = "56px";
        fabbtn.style.width = "56px";
      }
    };
  }, []);
}

export default useTabbar;
