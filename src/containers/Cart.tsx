import * as React from 'react';
import { InputLabel, Typography, MenuItem, FormControl, Select, SelectChangeEvent, Container, Box, Paper, Grid } from '@mui/material';
import CartItem from '../components/CartItem';
import _ from 'lodash';

import { AmazonMembership, CartContext, FacebookMembership, MicrosoftMembership, NoneMembership } from '../context/CartContext';

const Cart = () => {
  const { cartItems, increaseProduct, decreaseProduct, setCartMembership, cartMembership, calculateTotal } = React.useContext(CartContext) as CartContextType;

  const handlePrivilegeChanged = (event: SelectChangeEvent<string>) => {
    const {
      target: { value },
    } = event;

    switch (value) {
      case 'None':
        setCartMembership(NoneMembership)
        break;
      case 'Microsoft':
        setCartMembership(MicrosoftMembership)
        break;
      case 'Amazon':
        setCartMembership(AmazonMembership)
        break;
      case 'Facebook':
        setCartMembership(FacebookMembership)
        break;
      default:
        setCartMembership(NoneMembership)
        break;
    }
  };

  return (
    <Container fixed>
      <Box sx={{ flexGrow: 1, marginBottom: 1 }}>
        <Grid container spacing={2} columns={9}>
          <Grid item xs={3}>
            <Typography variant="h6" color="dark">
              Product
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="h6" color="dark">
              Quantity
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="h6" color="dark">
              SubTotal
            </Typography>
          </Grid>
        </Grid>
      </Box>
      {cartItems.map((item: ICartItem) => (
        <CartItem key={item.id} increaseProduct={increaseProduct} decreaseProduct={decreaseProduct} cartItem={item} />
      ))}
      <Box sx={{ minWidth: 120, marginTop: 5 }}>
        <Paper elevation={0}>
          <Typography variant="h6" color="primary">
            Total Amount
          </Typography>
          <Typography variant="h4" color="primary">
            {_.ceil(calculateTotal(), 2)}
          </Typography>

        </Paper>
      </Box>
      <Box sx={{ minWidth: 120, marginTop: 5 }}>
        <FormControl fullWidth>
          <InputLabel>Privilege</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={cartMembership.name}
            label="Privilege"
            onChange={handlePrivilegeChanged}
          >
            <MenuItem value={'None'}>None</MenuItem>
            <MenuItem value={'Microsoft'}>Microsoft</MenuItem>
            <MenuItem value={'Amazon'}>Amazon</MenuItem>
            <MenuItem value={'Facebook'}>Facebook</MenuItem>
          </Select>
        </FormControl>
      </Box>


    </Container>
  );
};

export default Cart;