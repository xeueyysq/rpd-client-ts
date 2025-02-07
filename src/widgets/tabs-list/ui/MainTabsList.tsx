import { FC } from "react";
import {
  List,
  Box,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  ListItemIcon,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "@entities/auth";
import { mainTabs } from "../model/consts";

// interface MainTabsListProps {
//   setIsMain: (value: boolean) => void;
// }

export const MainTabsList: FC = () => {
  const { handleLogOut } = useContext(AuthContext);
  const navigate = useNavigate();
  return (
    <Box sx={{ overflow: "auto" }}>
      <List>
        {mainTabs.map((value) => (
          <>
            {value.name === "Выйти" && <Divider />}
            <ListItem
              key={value.name}
              onClick={
                value.name === "Выйти"
                  ? handleLogOut
                  : () => value.path && navigate(value.path)
              }
              disablePadding
              sx={{ width: "100%" }}
            >
              <ListItemButton sx={{ width: "100%", py: 2 }}>
                <ListItemIcon sx={{ marginLeft: 2 }}>{value.icon}</ListItemIcon>
                <ListItemText primary={value.name} />
              </ListItemButton>
            </ListItem>
          </>
        ))}
      </List>
    </Box>
  );
};
