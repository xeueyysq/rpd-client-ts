import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { FC, useCallback, useEffect, useState } from "react";
import { useStore } from "@shared/hooks";
import { TemplateConstructorType, TemplateStatus } from "@entities/template";
import { useAuth } from "@entities/auth";
import { axiosBase } from "@shared/api";
import { showErrorMessage, showSuccessMessage } from "@shared/lib";
import { Loader } from "@shared/ui";

interface TemplateStatusObject {
  date: string;
  status: string;
  user: string;
}

interface TemplateData {
  id: number;
  disciplins_name: string;
  teacher: string;
  status: TemplateStatusObject;
}

export interface uploadTemplateDataParams {
  year: string | undefined;
  disciplinsName: string;
  id: number;
  userName: string | undefined;
}

export const CreateRpdTemplateFromYear: FC<TemplateConstructorType> = ({
  setChoise,
}) => {
  const selectedTemplateData = useStore.getState().selectedTemplateData;
  const createByCriteria = useStore.getState().createByCriteria;
  const userName = useAuth.getState().userName;
  const [data, setData] = useState<TemplateData[]>();

  const fetchData = useCallback(async () => {
    const params = {
      ...selectedTemplateData,
      year: Number(selectedTemplateData.year),
    };

    try {
      const response = await axiosBase.get("find-by-criteria", { params });
      setData(response.data);
    } catch (error) {
      showErrorMessage("Ошибка при получении данных");
      console.error(error);
    }
  }, [selectedTemplateData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const uploadTempllateData = async (disciplinsName: string, id: number) => {
    try {
      const params: uploadTemplateDataParams = {
        year: createByCriteria.year,
        disciplinsName,
        id,
        userName,
      };
      const response = await axiosBase.post("find-or-create-profile-template", {
        params,
      });

      if (response.data.status === "record exists")
        showErrorMessage("Ошибка. Шаблон с текущими данными уже существует");
      if (response.data === "template created") {
        showSuccessMessage("Шаблон успешно создан");
        fetchData();
      }
    } catch (error) {
      showErrorMessage("Ошибка создания шаблона");
      console.error(error);
    }
  };

  if (!data) return <Loader />;

  return (
    <>
      <Box>
        Шаг 3. Создание шаблона на {createByCriteria.year} на основе{" "}
        {selectedTemplateData.year}
      </Box>
      <Box sx={{ py: 2, fontSize: "18px", fontWeight: "600" }}>Шаблоны:</Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "600" }}>
                Название дисциплины
              </TableCell>
              <TableCell sx={{ fontWeight: "600" }}>Год шаблона</TableCell>
              <TableCell sx={{ fontWeight: "600" }}>
                Преподаватель, ответственный за РПД
              </TableCell>
              <TableCell sx={{ fontWeight: "600" }}>Статус</TableCell>
              <TableCell sx={{ fontWeight: "600" }}>Выбрать</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell>{row.disciplins_name}</TableCell>
                <TableCell>{selectedTemplateData.year}</TableCell>
                <TableCell>{row.teacher}</TableCell>
                <TableCell>
                  <TemplateStatus status={row.status} />
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() =>
                      uploadTempllateData(row.disciplins_name, row.id)
                    }
                  >
                    Создать шаблон
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Button
        variant="outlined"
        sx={{ mt: 2 }}
        onClick={() => setChoise("workingType")}
      >
        Назад
      </Button>
    </>
  );
};
