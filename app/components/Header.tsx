"use client";

import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
} from "@chakra-ui/react";
import {
  ChevronDownIcon,
  AddIcon,
  EditIcon,
  DeleteIcon,
} from "@chakra-ui/icons";
import {
  FaBook,
  FaUser,
  FaLayerGroup,
  FaUsers,
  FaTags,
  FaLanguage,
  FaRegClipboard,
  FaBookOpen,
  FaQuestionCircle
} from "react-icons/fa";
import NextLink from "next/link";
import type { IconType } from "react-icons";

interface ManageMenuProps {
  label: string;
  basePath: string;
  icon: IconType;
  disclosure: ReturnType<typeof useDisclosure>;
  showEdit: boolean;
}

const ManageMenu: React.FC<ManageMenuProps> = ({
  label,
  basePath,
  icon,
  disclosure,
  showEdit,
}) => (
  <Menu isOpen={disclosure.isOpen} onClose={disclosure.onClose}>
    <MenuButton
      as={Button}
      rightIcon={<ChevronDownIcon />}
      variant="ghost"
      fontWeight="semibold"
      fontSize="md"
      px={4}
      py={2}
      borderRadius="md"
      onMouseEnter={disclosure.onOpen}
      onMouseLeave={disclosure.onClose}
      _hover={{ bg: "gray.100", color: "teal.600" }}
      leftIcon={<Icon as={icon} boxSize={4} />}
    >
      {label}
    </MenuButton>
    <MenuList
      onMouseEnter={disclosure.onOpen}
      onMouseLeave={disclosure.onClose}
    >
      <NextLink href={`/${basePath}/create`} passHref>
        <MenuItem icon={<AddIcon />}>
          Create {label}
        </MenuItem>
      </NextLink>
      {showEdit !== false && (
        <NextLink href={`/${basePath}/edit`} passHref>
          <MenuItem icon={<EditIcon />}>
            Edit {label}
          </MenuItem>
        </NextLink>
      )}
      <NextLink href={`/${basePath}/delete`} passHref>
        <MenuItem icon={<DeleteIcon />}>
          Delete {label}
        </MenuItem>
      </NextLink>
    </MenuList>
  </Menu>
);

const Header = () => {
  const categoriesDisclosure = useDisclosure();
  const booksDisclosure = useDisclosure();
  const authorsDisclosure = useDisclosure();
  const audiencesDisclosure = useDisclosure();
  const genresDisclosure = useDisclosure();
  const languagesDisclosure = useDisclosure();
  const planDisclosure = useDisclosure();
  const faqsDisclosure = useDisclosure();

  const mainMenuDisclosure = useDisclosure();

  return (
    <Box
      as="header"
      bg="white"
      px={6}
      py={4}
      boxShadow="sm"
      borderBottom="1px solid"
      borderColor="gray.200"
      position="sticky"
      top={0}
      zIndex={1000}
    >
      <Flex
        maxW="1200px"
        mx="auto"
        align="center"
        justify="space-between"
        direction={{ base: "column", md: "row" }}
        gap={4}
        flexWrap="wrap"
      >

        <Menu
          isOpen={mainMenuDisclosure.isOpen}
          onClose={mainMenuDisclosure.onClose}
        >
          <MenuButton
            as={Heading}
            size="md"
            color="teal.600"
            cursor="pointer"
            onMouseEnter={mainMenuDisclosure.onOpen}
            onMouseLeave={mainMenuDisclosure.onClose}
          >
            Admin Panel
          </MenuButton>
          <MenuList
            onMouseEnter={mainMenuDisclosure.onOpen}
            onMouseLeave={mainMenuDisclosure.onClose}
          >
            <NextLink href="/category/top-books" passHref>
              <MenuItem icon={<FaBookOpen />}>
                Manage Top Books by Category
              </MenuItem>
            </NextLink>
            <NextLink href="/Pending-Dispatch" passHref>
              <MenuItem icon={<FaBookOpen />}>
                Manage Pending Dispatch books
              </MenuItem>
            </NextLink>
          </MenuList>
        </Menu>

        <Flex gap={3} wrap="wrap">
          <ManageMenu
            label="Categories"
            basePath="category"
            icon={FaLayerGroup}
            disclosure={categoriesDisclosure}
            showEdit={true}
          />
          <ManageMenu
            label="Books"
            basePath="books"
            icon={FaBook}
            disclosure={booksDisclosure}
            showEdit={true}
          />
          <ManageMenu
            label="Authors"
            basePath="authors"
            icon={FaUser}
            disclosure={authorsDisclosure}
            showEdit={true}
          />
          <ManageMenu
            label="Audiences"
            basePath="audiences"
            icon={FaUsers}
            disclosure={audiencesDisclosure}
            showEdit={true}
          />
          <ManageMenu
            label="Genres"
            basePath="genres"
            icon={FaTags}
            disclosure={genresDisclosure}
            showEdit={false}
          />
          <ManageMenu
            label="Languages"
            basePath="languages"
            icon={FaLanguage}
            disclosure={languagesDisclosure}
            showEdit={true}
          />
          <ManageMenu
            label="Plan"
            basePath="plan"
            icon={FaRegClipboard}
            disclosure={planDisclosure}
            showEdit={false}
          />
          <ManageMenu
            label="FAQS"
            basePath="faqs"
            icon={FaQuestionCircle}
            disclosure={faqsDisclosure}
            showEdit={false}
          />
        </Flex>
      </Flex>
    </Box>
  );
};

export default Header;
