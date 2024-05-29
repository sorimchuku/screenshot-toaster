import { IconNames } from '@blueprintjs/icons';
import { Icon } from '@blueprintjs/core';

// below is list of components that appear in sidebar
// id - unique id
// title - title of tool
// icon - imported icon from material ui
// component - component string needed for conditional rendering in itemsList.js
export const tools = [
    {
        id: 0,
        title: "Uploads",
        icon: <Icon icon={IconNames.UPLOAD} />,
        component: "uploadSection",
    },
    {
        id: 1,
        title: "Backgrounds",
        icon: <Icon icon={IconNames.STYLE} />,
        component: "backgroundsSection",
    },
    {
        id: 3,
        title: "Share",
        icon: <Icon icon={IconNames.SHARE} />,
        component: "shareSection",
    },
];