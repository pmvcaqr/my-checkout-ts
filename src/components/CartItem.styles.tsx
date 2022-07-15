import { styled, Paper } from '@mui/material';

export const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.h5,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.primary.main
}));