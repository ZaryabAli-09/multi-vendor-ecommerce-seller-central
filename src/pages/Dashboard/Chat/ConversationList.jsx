import React from "react";
import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  Box,
} from "@mui/material";
import { formatDistanceToNow } from "date-fns";

const ConversationList = ({ conversations, onSelectBuyer }) => {
  return (
    <List
      className="overflow-y-auto"
      style={{ maxHeight: "calc(100vh - 64px)" }}
    >
      {conversations.length > 0 ? (
        conversations.map((conversation) => (
          <ListItem
            key={conversation._id}
            button
            onClick={() => onSelectBuyer(conversation)}
            className="hover:bg-gray-50 cursor-pointer"
          >
            <ListItemAvatar>
              <Avatar src="/default-avatar.png" alt={conversation.name} />
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography className="font-medium">
                  {conversation.name || "Unknown User"}
                </Typography>
              }
              secondary={
                <>
                  <Typography component="span" className="block truncate">
                    {conversation.lastMessage || "No messages yet"}
                  </Typography>
                  <Typography
                    component="span"
                    className="block text-xs text-gray-500"
                  >
                    {formatDistanceToNow(new Date(conversation.timestamp), {
                      addSuffix: true,
                    })}
                  </Typography>
                </>
              }
              secondaryTypographyProps={{ component: "div" }}
            />
          </ListItem>
        ))
      ) : (
        <Box className="p-4 text-center">
          <Typography variant="body1" className="text-gray-500">
            No conversations yet
          </Typography>
        </Box>
      )}
    </List>
  );
};

export default ConversationList;
