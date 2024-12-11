import { Box, Grid, Stack } from "@mui/material";
import * as React from "react";

/**
 * A layout for a normal (non-map) page
 *
 * Handles:
 *   * Fullscreen container
 *   * Background color (default)
 *   * Basic structure -- fixed header slot & content
 */

interface Props {
  header?: React.ReactNode;
  content?: React.ReactNode;
  className?: string;
}

// Responsively centered header and content
function Row(props: { children: React.ReactNode }) {
  return (
    <Grid container justifyContent="center">
      <Grid item xs={12} md={8}>
        {props.children}
      </Grid>
    </Grid>
  );
}

function PageLayout(props: Props) {
  return (
    <Stack spacing={1} sx={{ maxHeight: "100vh" }}>
      <Box pt={2}>
        <Row>{props.header}</Row>
      </Box>
      {/* Only body of page should scroll, but pad a bit since overflow can cause slight offsets, like hiding shadows */}
      <Box sx={{ overflowY: "auto", paddingBottom: "8px" }}>
        <Row>{props.content}</Row>
      </Box>
    </Stack>
  );
}

export default PageLayout;
