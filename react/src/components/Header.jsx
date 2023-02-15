import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import {
    Box,
    Flex,
    Avatar,
    HStack,
    IconButton,
    Button,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    useDisclosure,
    useColorModeValue,
    Stack,
    Text,
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";

function Header() {
    const { isOpen, onOpen, onClose } = useDisclosure();
	const btnRef = useRef()

    const fontSz = "13px";
    const txtStyle = {
        ml: "0px",
        px: "10px",
        py: "10px",
        fontWeight: "500",
        fontSize: fontSz,
        _hover: {
            textDecoration: "none",
            color: "white",
            bg: useColorModeValue("teal.400", "teal.900"),
        },
    };

    const navLinks = [
        {
            name: "Home",
            href: "/",
        },
    ];

    return (
        <div>
            <Box
                bg={useColorModeValue("teal.200", "teal.700")}
                px={4}
                h={10}
                boxShadow="base"
                color="blackAlpha.700"
            >
                <Flex
                    h={10}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                >
                    <IconButton
                        size={"md"}
                        icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
                        aria-label={"Open Menu"}
                        display={{ md: "none" }}
                        onClick={isOpen ? onClose : onOpen}
						ref={btnRef}
						colorScheme='teal.200'
						color="blackAlpha.700"
                    />
                    <HStack spacing={4} alignItems={"center"}>
                        <Box>
                            <Text sx={{ fontWeight: "700" }}>
                                Travel App
                            </Text>
                        </Box>
                        <HStack
                            as={"nav"}
                            display={{ base: "none", md: "flex" }}
                        >
                            {navLinks.map((a) => (
                                <Link key={a.name} to={a.href}>
                                    <Text sx={txtStyle}>{a.name}</Text>
                                </Link>
                            ))}
                        </HStack>
                    </HStack>
                </Flex>
            </Box>
            <Drawer
                isOpen={isOpen}
                placement="right"
                onClose={onClose}
                finalFocusRef={btnRef}
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />

                    <DrawerBody>
						<Stack
                            as={"nav"}
                            display={{ md: "flex" }}
							p={0}
                        >
                            {navLinks.map((a) => (
                                <Link key={a.name} to={a.href}>
                                    <Text sx={{
										ml: "0px",
										px: "10px",
										py: "10px",
										fontWeight: "500",
										fontSize: fontSz,
										_hover: {
											textDecoration: "none",
											color: "teal.500",
										},
									}}>{a.name}</Text>
                                </Link>
                            ))}
                        </Stack>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </div>
    );
}

export default Header;
