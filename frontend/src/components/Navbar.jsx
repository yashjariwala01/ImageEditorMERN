import React from 'react'
import { AppBar,Toolbar, IconButton, Typography, Stack, Button} from '@mui/material'
import FilterHdrIcon from '@mui/icons-material/FilterHdr';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const Navigate = useNavigate()

  return (
    <AppBar position='static'>
        <Toolbar className='toolbarCustom'>

          <div className='logoAndName' onClick={()=> Navigate('/homepage')}>
          <IconButton size='large' edge='Start' color='inherit' aria-label='logo'>
                <FilterHdrIcon/>
            </IconButton>
            <Typography variant='h6' component='div' sx={{flexGrow:1}}>
                DeltaCanvas
            </Typography>
          </div>
            
            <Stack direction='row' spacing={2}>
                <Button  onClick={()=> Navigate('/canvas')} color='inherit'>Canvas</Button>
                <Button onClick={()=> Navigate('/homepage')} color='inherit'>Home</Button>
                <Button  onClick={()=> Navigate('/about')} color='inherit'>About</Button>
                <Button  onClick={()=> Navigate('/')} color='inherit'>New Registeration</Button>
                <Button onClick={()=> Navigate('/downloads')} color='success' variant='contained'>Downloads</Button>
            </Stack>
        </Toolbar>
    </AppBar>
  )
}

export default Navbar
