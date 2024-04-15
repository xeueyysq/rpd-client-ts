import { FC } from 'react';
import JsonChangeValue from './changeable-elements/JsonChangeValue';
import { Box } from '@mui/material';

const DisciplineEvaluationsFunds: FC = () => {
    return (
        <Box>
            <Box component='h2'>Фонды оценочных средств по дисциплине</Box>
            <Box sx={{
                p: 1,
                border: '1px dashed grey',
                my: 1,
                '& ol': {
                    p: 1
                },
                '& li': {
                    ml: "60px",
                },
                '& p': {
                    p: 1
                }
            }}>
                <JsonChangeValue elementName='assessment_tools_template'/>
            </Box>
        </Box>
    );
}

export default DisciplineEvaluationsFunds;