import {FC, useCallback, useEffect, useState} from "react"
import {useStore} from "@shared/hooks"
import {Box, Button, CircularProgress} from "@mui/material"
import {TemplateConstructorType} from "@entities/template"
import {templateDataTitles} from "../model/templateDataTitles.ts"
import {Loader} from "@shared/ui"
import {axiosBase} from "@shared/api"
import {showErrorMessage, showSuccessMessage} from "@shared/lib"

export const TemplateConstructor: FC<TemplateConstructorType> = ({setChoise}) => {
    const selectedTemplateData = useStore.getState().selectedTemplateData
    const {setComplectId} = useStore()
    const [createComplectStatus, setCreateComplectStatus] = useState<string>("pending")
    const [isFindComplect, setIsFindComplect] = useState<boolean | undefined>(undefined)

    const fetchData = useCallback(async () => {
        try {
            const responce = await axiosBase.post('find_rpd_complect', {
                data: selectedTemplateData
            })
            if (responce.data === "NotFound") setIsFindComplect(false)
            else {
                setIsFindComplect(true)
                setComplectId(responce.data.id)
            }
        } catch (error) {
            showErrorMessage("Ошибка загрузки данных")
            console.error(error)
        }
    }, [selectedTemplateData, setComplectId])

    const createRpdComplect = async () => {
        try {
            setCreateComplectStatus("loading")
            const responce = await axiosBase.post('create_rpd_complect', {
                data: selectedTemplateData
            })
            setComplectId(responce.data)
            setCreateComplectStatus("success")
            showSuccessMessage("Комплект РПД создан успешно")
        } catch (error) {
            showErrorMessage("Ошибка загрузки данных")
            console.error(error)
        }
    }

    useEffect(() => {
        fetchData()
    }, [fetchData])

    return (
        <>
            <Box>Шаг 2. Создание/редактирование комплекта РПД</Box>
            <Box sx={{py: 2, fontSize: "18px", fontWeight: "600"}}>Выбранные данные:</Box>
            {Object.entries(selectedTemplateData).map(([key, value]) => (
                <Box sx={{pl: "40px"}} key={key}>
                    <Box component="span" sx={{fontWeight: "600"}}>{templateDataTitles[key]}: </Box>
                    {value ? value : "Данные не найдены"}
                </Box>
            ))}
            {isFindComplect === undefined ?
                <Loader/>
                :
                <>
                    {!isFindComplect ?
                        <Box sx={{py: 2}}>
                            {createComplectStatus === "pending" &&
                                <>
                                    <Box>Комплект РПД не найден. Создать на основе 1С выгрузки?</Box>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={() => createRpdComplect()}
                                    >Создать</Button>
                                </>
                            }
                            {createComplectStatus === "loading" &&
                                <Box sx={{p: 1, display: 'flex'}}>
                                    <CircularProgress color="inherit" size="1rem"/>
                                    <Box sx={{px: 1}}>Идет создание комплекта РПД. Это может занять какое-то время</Box>
                                </Box>
                            }
                            {createComplectStatus === "success" &&
                                <Box>
                                    <Box>Шаблон создан успешно. Перейти к редактированию?</Box>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={() => setChoise("createTemplateFromExchange")}
                                    >Перейти</Button>
                                </Box>
                            }

                        </Box>
                        :
                        <Box sx={{py: 2}}>
                            <Box>Комплект РПД загружен. Перейти к редактированию?</Box>
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={() => setChoise("createTemplateFromExchange")}
                            >Перейти</Button>
                        </Box>
                    }
                </>
            }

            <Button variant="outlined" onClick={() => setChoise("selectData")}>Назад</Button>
        </>
    )
}