import React from 'react';
import { TableCell, IconButton, Tooltip } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const CopyClip = ({ value }) => {
  const maskedValue = `${value.slice(0, 4)}...${value.slice(-4)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
  };

  return (
    <TableCell style={{ whiteSpace: 'nowrap' }}>
      {maskedValue}
      <Tooltip title="Copy to clipboard">
        <IconButton size="small" onClick={handleCopy}>
          <ContentCopyIcon fontSize="18px" />
        </IconButton>
      </Tooltip>
    </TableCell>
  );
};

export default CopyClip;

