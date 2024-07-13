// below is list of components that appear in sidebar
// id - unique id
// title - title of tool
// icon - imported icon from material ui
// component - component string needed for conditional rendering in itemsList.js
export const tools = [
    {
        id: 0,
        title: "배경 색상",
        component: "BackgroundSection",
    },
    {
        id: 1,
        title: "레이아웃 변경",
        component: "LayoutSelectSection",
    },
    {
        id: 2,
        title: "제목",
        component: "TitleSection",
    },
    {
        id: 3,
        title: "소제목",
        component: "SubTitleSection",
    },
    {
        id: 4,
        title: "스크린샷 소스 이미지",
        component: "UploadSection",
    },
    
];
