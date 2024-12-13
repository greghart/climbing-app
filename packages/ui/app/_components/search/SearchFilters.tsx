import DifficultySlider from "@/app/_components/search/DifficultySlider";
import SearchShadeCheck from "@/app/_components/search/SearchShadeCheck";
import SearchTypeSelect from "@/app/_components/search/SearchTypeSelect";
import SunHoursField from "@/app/_components/search/SunHoursField";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Card,
  FormControl,
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
              <SearchShadeCheck />
              <DifficultySlider />
              <FormControl fullWidth sx={{ p: 1 }}>
                <SunHoursField coordinate={props.shadeLocation} />
              </FormControl>
            </FormGroup>
          </Stack>
        </AccordionDetails>
      </Accordion>
    </Card>
  );
}
