interface Props{
    cartItem: CartItem;
    onDelete: (cartItemId)=> void;
}

export default function CartItem({cartItem,onDelete()}Props) {
    return (
        <div>
        <Conatiner>
            <ButtonRaw>
                <input type="checkbox"/>
                <button onClick= {()=> {onDelete(cartItem.cartItemId)}}/>
            </ButtonRaw>
            <ItemContainer>
                <img src={cartItem.thumbnailUrl}/>
                <ItemInfoContainer>
                    <p>{cartItem.name}</p>
                    <p>{cartItem.price}원</p>
                    <QuantityChangeButton/>
                </ItemInfoContainer>

            </ItemContainer>
            
        </Container>
    </div>
    );
}
  


