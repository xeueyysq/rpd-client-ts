import { useState, MouseEvent, FC, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Menu, MenuItem, ListItemIcon, ListItemText, Typography, Divider } from '@mui/material';
import { BorderColor, Description, ListAlt, AccountCircle, Logout } from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import useStore from '../../store/useStore';
import Can from '../../ability/Can';
import { AuthContext } from '../../context/AuthContext';
import useAuth from '../../store/useAuth';

const HeaderMenuMobile: FC = () => {
    //@NOTE Типизация
    //@ts-expect-error
    const { handleLogOut, isUserLogged } = useContext(AuthContext);
    const userName = useAuth.getState().userName;

    const [anchorEl, setAnchorEl] = useState<null | HTMLButtonElement>(null);
    const { jsonData } = useStore();
    const open = Boolean(anchorEl);

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            {isUserLogged &&
                <Box>
                    <Button
                        id="basic-button"
                        aria-controls={open ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                        endIcon={
                            <MenuIcon sx={{ color: "black" }} />
                        }
                        sx={{
                            color: "black",
                            my: "10px"
                        }}
                    >
                        Меню
                    </Button>
                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                    >
                        {/* <Can I="get" a="rop_interface">
                            <MenuItem onClick={handleClose}>
                                <ListItemIcon>
                                    <ListAlt />
                                </ListItemIcon>
                                <ListItemText>
                                    <Link to="/manager" style={{ textDecoration: "none" }}>
                                        <Typography variant="button" display="block" gutterBottom color="grey" m="0">
                                            Интерфейс РОП
                                        </Typography>
                                    </Link>
                                </ListItemText>
                            </MenuItem>
                        </Can>
                        <Can I="get" a="teacher_interface">
                            <MenuItem onClick={handleClose} disabled={Object.keys(jsonData).length ? false : true}>
                                <ListItemIcon>
                                    <Description />
                                </ListItemIcon>
                                <ListItemText>
                                    <Link to="/teacher-interface" style={{ textDecoration: "none" }}>
                                        <Typography variant="button" display="block" gutterBottom color="grey" m="0">
                                            Интерфейс преподавателя
                                        </Typography>
                                    </Link>
                                </ListItemText>
                            </MenuItem>
                        </Can>
                        <Can I="get" a="change_templates">
                            <MenuItem onClick={handleClose}>
                                <ListItemIcon>
                                    <BorderColor />
                                </ListItemIcon>
                                <ListItemText>
                                    <Link to="/rpd-template" style={{ textDecoration: "none" }}>
                                        <Typography variant="button" display="block" gutterBottom color="grey" m="0">
                                            Шаблон РПД
                                        </Typography>
                                    </Link>
                                </ListItemText>
                            </MenuItem>
                        </Can> */}
                        <Divider />
                        <MenuItem>
                            <ListItemIcon>
                                <AccountCircle />
                            </ListItemIcon>
                            <ListItemText>
                                <Typography variant="button" display="block" gutterBottom color="grey" m="0">
                                    {userName}
                                </Typography>
                            </ListItemText>
                        </MenuItem>
                        <MenuItem>
                            <ListItemIcon>
                                <Logout />
                            </ListItemIcon>
                            <ListItemText>
                                <Button onClick={handleLogOut} size="small" sx={{ color: "grey" }}>
                                    Выйти
                                </Button>
                            </ListItemText>
                        </MenuItem>
                    </Menu>
                </Box>
            }
        </>
    );
}

export default HeaderMenuMobile;