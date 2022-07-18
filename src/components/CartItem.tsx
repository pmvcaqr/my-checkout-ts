import * as React from 'react';
import _ from 'lodash';
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Item } from './CartItem.styles';


type Props = {
  cartItem: ICartItem;
  increaseProduct: (cartItem: ICartItem) => void;
  decreaseProduct: (cartItem: ICartItem) => void;
};

const CartItem: React.FC<Props> = ({ cartItem, increaseProduct, decreaseProduct }) => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2} columns={9}>
        <Grid item xs={3}>
          <Item elevation={1}>{cartItem.name}</Item>
        </Grid>
        <Grid item xs={3}>
          <ButtonGroup fullWidth size='large'>
            <Button onClick={() => decreaseProduct(cartItem)}>-</Button>
            <Button color="secondary">{cartItem.products.length}</Button>
            <Button onClick={() => increaseProduct(cartItem)}>+</Button>
          </ButtonGroup>
        </Grid>
        <Grid item xs={3}>
          <Item>{_.ceil(cartItem.subTotal, 2)}</Item>
        </Grid>
      </Grid>
    </Box>
  );
};
export default CartItem;