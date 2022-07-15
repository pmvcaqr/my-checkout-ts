import * as React from 'react';
import _ from 'lodash';
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { Item } from './CartItem.styles';


type Props = {
  cartGroup: ICartGroup;
  // addToCart: (cartGroup: ICartGroup) => void;
  // removeFromCart: (cartGroup: ICartGroup) => void;
  onCartChanged: () => void;
};

const CartItem: React.FC<Props> = ({ cartGroup, onCartChanged }) => {
  React.useEffect(() => {
    console.log('cartGroup.productItems.length');
  }, [cartGroup]);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2} columns={9}>
        <Grid item xs={3}>
          <Item>{cartGroup.name}</Item>
          {/* <Item>{cartItem.description}</Item> */}
        </Grid>
        <Grid item xs={3}>
          <ButtonGroup fullWidth size='large'>
            <Button onClick={() => {cartGroup.decreaseProductItem(); onCartChanged()}}>-</Button>
            <Button color="secondary">{cartGroup.getQuantity()}</Button>
            <Button onClick={() => cartGroup.increaseProductItem()}>+</Button>
          </ButtonGroup>
        </Grid>
        <Grid item xs={3}>
          {/* <Item>Subtotal</Item> */}
          <Item>{_.ceil(cartGroup.subTotal(), 2)}</Item>
        </Grid>
      </Grid>
    </Box>
  );
};
export default CartItem;