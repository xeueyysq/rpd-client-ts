import { FC, useState } from "react";
import { parseCsvToJson } from "@shared/ability/lib/parseCsvToJson";
import { ParsedPlannedResults } from "@shared/ability/lib/parseCsvToJson";
import { showSuccessMessage, showErrorMessage } from "@shared/lib";
import { Box } from "@mui/system";
import {
  Paper,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Table,
  TableBody,
  Container,
  Typography,
  Button,
} from "@mui/material";
import { Rowing } from "@mui/icons-material";
import { axiosBase } from "@shared/api";

interface ResultsRow {
  competence: string;
  indicator: string;
  disciplines: string[];
}

interface ResultsData {
  [id: number]: ResultsRow;
}

export const PlannedResultsList: FC = () => {
  const [data, setData] = useState<ResultsData | undefined>();
  const groupData = (parsedData: ParsedPlannedResults) => {
    const resultsData: ResultsData = {};
    let currentId = 0;
    let currentCompetence = "";

    for (const index in parsedData) {
      const item = parsedData[index];

      if (item.competence) {
        currentCompetence = `${item.competence}. ${item.results}`;
      } else if (item.indicator) {
        resultsData[currentId] = {
          competence: currentCompetence,
          indicator: `${item.indicator}. ${item.results}`,
          disciplines: [],
        };
        currentId++;
      } else if (item.results) {
        resultsData[currentId - 1].disciplines.push(item.results);
      }
    }
    return resultsData;
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const parsedData = await parseCsvToJson(file);
      const resultsData = groupData(parsedData as ParsedPlannedResults);
      setData(resultsData);
    } catch (error) {
      console.error(error);
    }
  };

  const saveData = async () => {
    try {
      const response = await axiosBase.post("set-results-data", {
        data: data,
      });
      if (response.status === 200) {
        showSuccessMessage("Данные успешно загружены");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Неизвестная ошибка";
      showErrorMessage(errorMessage);
      console.error(error);
    }
  };
  const headers = [
    "Формируемые компетенции (код и наименование)",
    "Индикаторы достижения компетенций (код и формулировка)",
    "Дисциплины",
  ];
  return (
    <Container maxWidth="xl">
      <Box component="h2" sx={{ py: 1 }}>
        Загрузка компетенций для всех дисциплин
      </Box>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        py={1}
      >
        <input type="file" accept=".csv" onChange={handleFileUpload} />
        <Button onClick={() => saveData()} variant="contained">
          Сохранить
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {headers.map((header) => (
                <TableCell key={header}>{header}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data &&
              Object.entries(data).map(([key, row]) => (
                <TableRow key={key}>
                  <TableCell>
                    {Number(key) === 0 ||
                    row.competence !== data[Number(key) - 1].competence
                      ? row.competence
                      : ""}
                  </TableCell>
                  <TableCell>{row.indicator}</TableCell>
                  <TableCell>{row.disciplines.join(", ")}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};
