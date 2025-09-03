import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const Navdata = () => {
  const history = useNavigate();
  //state data
  const [isDashboard, setIsDashboard] = useState<boolean>(false);
  const [isMultiLevel, setIsMultiLevel] = useState<boolean>(false);
  const [isIMS, setIsIMS] = useState<boolean>(false);

  // Multi Level
  const [isLevel1, setIsLevel1] = useState<boolean>(false);
  const [isLevel2, setIsLevel2] = useState<boolean>(false);

  // IMS
  const [isMedicine, setIsMedicine] = useState<boolean>(false);

  const [iscurrentState, setIscurrentState] = useState("Dashboard");

  function updateIconSidebar(e: any) {
    if (e && e.target && e.target.getAttribute("sub-items")) {
      const ul: any = document.getElementById("two-column-menu");
      const iconItems: any = ul.querySelectorAll(".nav-icon.active");
      let activeIconItems = [...iconItems];
      activeIconItems.forEach((item) => {
        item.classList.remove("active");
        var id = item.getAttribute("sub-items");
        const getID = document.getElementById(id) as HTMLElement;
        if (getID) getID.classList.remove("show");
      });
    }
  }

  useEffect(() => {
    document.body.classList.remove("twocolumn-panel");
    if (iscurrentState !== "Dashboard") {
      setIsDashboard(false);
    }
    if (iscurrentState !== "MuliLevel") {
      setIsMultiLevel(false);
    }

    if (iscurrentState !== "IMS") {
      setIsIMS(false);
    }

    if (iscurrentState === "Widgets") {
      history("/widgets");
      document.body.classList.add("twocolumn-panel");
    }
  }, [history, iscurrentState, isDashboard, isMultiLevel, isIMS]);

  const menuItems: any = [
    {
      label: "Menu",
      isHeader: true,
    },
    {
      id: "dashboard",
      label: "Dashboards",
      icon: "ri-dashboard-2-line",
      link: "/#",
      stateVariables: isDashboard,
      click: function (e: any) {
        e.preventDefault();
        setIsDashboard(!isDashboard);
        setIscurrentState("Dashboard");
        updateIconSidebar(e);
      },
      subItems: [
        {
          id: "analytics",
          label: "Analytics",
          link: "/dashboard-analytics",
          parentId: "dashboard",
        },
        {
          id: "crm",
          label: "CRM",
          link: "/dashboard-crm",
          parentId: "dashboard",
        },
        {
          id: "ecommerce",
          label: "Ecommerce",
          link: "/dashboard",
          parentId: "dashboard",
        },
      ],
    },
    {
      id: "multilevel",
      label: "Multi Level",
      icon: "ri-share-line",
      link: "/#",
      click: function (e: any) {
        e.preventDefault();
        setIsMultiLevel(!isMultiLevel);
        setIscurrentState("MuliLevel");
        updateIconSidebar(e);
      },
      stateVariables: isMultiLevel,
      subItems: [
        {
          id: "level1.1",
          label: "Level 1.1",
          link: "/#",
          parentId: "multilevel",
        },
        {
          id: "level1.2",
          label: "Level 1.2",
          link: "/#",
          isChildItem: true,
          click: function (e: any) {
            e.preventDefault();
            setIsLevel1(!isLevel1);
          },
          stateVariables: isLevel1,
          childItems: [
            { id: 1, label: "Level 2.1", link: "/#" },
            {
              id: "level2.2",
              label: "Level 2.2",
              link: "/#",
              isChildItem: true,
              click: function (e: any) {
                e.preventDefault();
                setIsLevel2(!isLevel2);
              },
              stateVariables: isLevel2,
              childItems: [
                { id: 1, label: "Level 3.1", link: "/#" },
                { id: 2, label: "Level 3.2", link: "/#" },
              ],
            },
          ],
        },
      ],
    },

    {
      label: "Inventory Management (IMS)",
      isHeader: true,
    },

    // START -- IMS
    {
      id: "ims",
      label: "Medicine",
      icon: "ri-share-line",
      link: "/#",
      click: function (e: any) {
        e.preventDefault();
        setIsIMS(!isIMS);
        setIscurrentState("IMS");
        updateIconSidebar(e);
      },
      stateVariables: isIMS,
      subItems: [
        {
          id: "category",
          label: "Category",
          link: "/category-list",
          parentId: "ims",
        },
        {
          id: "medicine",
          label: "Medicine",
          link: "/#",
          isChildItem: true,
          click: function (e: any) {
            e.preventDefault();
            setIsMedicine(!isMedicine);
          },
          stateVariables: isMedicine,
          childItems: [
            { id: 1, label: "Level 2.1", link: "/#" },
            {
              id: "level2.2",
              label: "Level 2.2",
              link: "/#",
              isChildItem: true,
              click: function (e: any) {
                e.preventDefault();
                setIsLevel2(!isLevel2);
              },
              stateVariables: isLevel2,
              childItems: [
                { id: 1, label: "Level 3.1", link: "/#" },
                { id: 2, label: "Level 3.2", link: "/#" },
              ],
            },
          ],
        },
      ],
    },
    // END -- IMS
  ];
  return <React.Fragment>{menuItems}</React.Fragment>;
};
export default Navdata;
