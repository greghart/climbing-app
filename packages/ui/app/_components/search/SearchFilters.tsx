import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Card,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  Stack,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ICoordinateLiteral } from "models";
import SunHoursField from "@/app/_components/search/SunHoursField";

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
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  What kind?
                </InputLabel>
                <Select
                  labelId="entity-type-select-label"
                  id="entity-type-select"
                  label="Looking for a specific type?"
                >
                  <MenuItem value="any">Any</MenuItem>
                  <MenuItem value="route">Routes</MenuItem>
                  <MenuItem value="boulder">Boulders</MenuItem>
                  <MenuItem value="area">Areas</MenuItem>
                </Select>
              </FormControl>
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
