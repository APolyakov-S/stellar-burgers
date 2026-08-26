import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader, IngredientDetailsUI } from '@ui';
import { useSelector } from '../../services/store';
import { selectIngredients } from '../../services/selectors/ingredientsSelectors';

export const IngredientDetailsPage: FC = () => {
  const { id } = useParams();
  const ingredients = useSelector(selectIngredients);
  const ingredient = ingredients.find((item) => item._id === id);

  if (!ingredient) {
    return <Preloader />;
  }

  return (
    <div
      style={{
        margin: '120px auto',
        display: 'flex',
        justifyContent: 'center'
      }}
    >
      <IngredientDetailsUI ingredientData={ingredient} />
    </div>
  );
};
