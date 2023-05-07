import useDirectory from "@/hooks/useDirectory";
import { Flex, Image, MenuItem, Icon } from "@chakra-ui/react";
import React from "react";
import { IconType } from "react-icons";

type MenuListItemProps = {
  displayText: string;
  link: string;
  icon: IconType;
  iconColor: string;
  imageURL?: string;
};

const MenuListItem = ({
  displayText,
  link,
  icon,
  iconColor,
  imageURL,
}: MenuListItemProps) => {
  const { onSelectMenuItem } = useDirectory();

  return (
    <MenuItem
      width={"100%"}
      fontSize="10pt"
      _hover={{ bg: "gray.100" }}
      onClick={() =>
        onSelectMenuItem({ displayText, link, icon, iconColor, imageURL })
      }
    >
      <Flex align={"center"}>
        {imageURL ? (
          <Image
            src={imageURL}
            borderRadius="full"
            mr={2}
            boxSize="20px"
            alt={`${displayText} community image`}
          />
        ) : (
          <Icon as={icon} fontSize={20} mr={2} color={iconColor} />
        )}
        {displayText}
      </Flex>
    </MenuItem>
  );
};

export default MenuListItem;
