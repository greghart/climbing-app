import SearchTypeSelect from "@/app/_components/search/SearchTypeSelect";
import SunHoursField from "@/app/_components/search/SunHoursField";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Card,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Stack,
} from "@mui/material";
import { ICoordinateLiteral } from "models";

interface Props {
  shadeLocation: ICoordinateLiteral;
}
export default function SearchFilters(props: Props) {
  return (
    <Card variant="outlined">
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          Search Filters
        </AccordionSummary>
        <AccordionDetails>
          <Stack>
            <FormGroup>
              <SearchTypeSelect />
              <FormControlLabel
                control={<Checkbox />}
                label="Only show shady(ish) routes at:"
              />
              <FormControl fullWidth>
                <SunHoursField coordinate={props.shadeLocation} />
              </FormControl>
            </FormGroup>
          </Stack>
        </AccordionDetails>
      </Accordion>
    </Card>
  );
}
