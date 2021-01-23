import { useEffect } from "react";

function useTabbar() {
  useEffect(() => {
    function hideTabbar() {
      var tabbar = document.getElementById(`appTabBar`);
      if (tabbar) tabbar.style.bottom = "-60px";
      var fabbtn = document.getElementById(`appFabBtn`);
      if (fabbtn) fabbtn.style.opacity = "0";
    }

    hideTabbar();

    return function showTabbar() {
      var tabbar = document.getElementById(`appTabBar`);
      if (tabbar) tabbar.style.bottom = "0";
      var fabbtn = document.getElementById(`appFabBtn`);
      if (fabbtn) fabbtn.style.opacity = "1";
    };
  }, []);
}

export default useTabbar;
