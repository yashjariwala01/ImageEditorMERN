import React from 'react'
import { AppBar,Toolbar, IconButton, Typography, Stack, Button} from '@mui/material'
import FilterHdrIcon from '@mui/icons-material/FilterHdr';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const Navigate = useNavigate()

  return (
    <AppBar color='secondary' position='static'>
        <Toolbar>

            <IconButton size='large' edge='Start' color='inherit' aria-label='logo'>
                <FilterHdrIcon/>
            </IconButton>
            <Typography variant='h6' component='div' sx={{flexGrow:1}}>
                DeltaCanvas
            </Typography>
            
            <Stack direction='row' spacing={2}>
                <Button  onClick={()=> Navigate('/')} color='inherit'>Register</Button>
                <Button  onClick={()=> Navigate('/login')} variant='contained' color='primary' >Login</Button>
            </Stack>
        </Toolbar>
    </AppBar>
  )
}

export default Header
