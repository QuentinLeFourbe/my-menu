import React, { useState, useContext, useEffect } from 'react';
import MealCreationForm from './components/MealCreationForm';
import styled from 'styled-components'
import MealList from './components/MealList';
import FiltersComponent from '../MenuManager/FloatingMealManager/FiltersComponent';
import { AppContext } from '../../AppContext';
import { SortType } from '../../Constant';
import { updateMeal, fetchMeals, deleteMeal, getMeal } from '../../api';
import MealEditOverlay from './components/MealEditOverlay';
import { animated, config, useSpring } from 'react-spring'

const Container = styled(animated.div)`
  flex-grow:1;
`;

const Wrapper = styled.div`
    border-style: solid;
    border-width: 0px 0px 1px 0px;
    border-color: #dee2e6;
    margin: 1rem;
    padding-top: 1rem;
`;

function MealsManager()
{
    const { dataState, dataDispatch } = useContext(AppContext);

    //EditForm overlay data
    const [editFormData, setEditFormData] = useState({ mealEdited: null, show: false, formImage: null });

    const showMealOverlay = async (mealId) =>
    {
        await getMeal(mealId)
            .then(response =>
            {
                let meal = response.data[0];
                setEditFormData({
                    ...editFormData,
                    formImage: meal.mealImage,
                    mealEdited: { ...meal, mealImage: '' },
                    show: true
                }); //Empty mealImage so it does not load the path in file Input and crash in the form
            })
            .catch(error =>
            {
                console.error("Error: " + error.message)
            });
    }

    const hideMealOverlay = () =>
    {
        setEditFormData({ ...editFormData, mealEdited: null, show: false })
    }

    //Filter Data
    const [filterData, setFilterData] = useState({
        meals: [],
        filter: {
            search: "",
            sort: SortType.A_Z
        }
    });

    //filter: {search: String, sort: SortType}
    const applyFilter = (filter) =>
    {
        if (filter === undefined)
        {
            console.error("Filter is undefined");
            return;
        }

        let filteredMeals =
            dataState.meals.filter(meal =>
                meal.name
                    .toLowerCase()
                    .includes(filter.search.toLowerCase())
            );

        filteredMeals.sort((meal1, meal2) => meal1.name.toLowerCase() > meal2.name.toLowerCase());
        if (filter.sort === SortType.Z_A)
        {
            filteredMeals = filteredMeals.reverse();
        }
        setFilterData({ ...filterData, meals: filteredMeals, filter: filter });
    }

    const onUpdateMeal = async (mealId, data) =>
    {
        const meal = { ...data };
        if (data.mealImage.length > 0)
        {
            meal.mealImage = data.mealImage[0]
        } else
        {
            console.log(delete meal.mealImage);
        }


        var formData = new FormData();
        for (var key in meal)
        {
            formData.append(key, meal[key]);
        }
        await updateMeal(mealId, formData)
            .then(() =>
            {
                dataDispatch({ type: 'meals/update', payload: formData })
            })
            .catch(error =>
            {
                console.error("Error: " + error.message)
            })

        await fetchMeals().then(response =>
        {
            dataDispatch({ type: 'meals/fetch', payload: response.data })
        })
    }

    const onDeleteMeal = async (mealId) =>
    {
        await deleteMeal(mealId).then(() =>
        {
            dataDispatch({ type: 'DELETE_MEAL', payload: mealId })
        })
            .catch(error =>
            {
                console.error("Error: " + error.message)
            });

        await fetchMeals().then(response =>
        {
            dataDispatch({ type: 'meals/fetch', payload: response.data })
        });
    }

    useEffect(() =>
    {
        let meals = dataState.meals;
        meals.sort((meal1, meal2) => meal1.name.toLowerCase() > meal2.name.toLowerCase());
        setFilterData({ ...filterData, meals: meals });
    }, [dataState])

    const spring = useSpring({
        from: { opacity: 0 },
        opacity: 1,
        delay: 200,
    })

    return (
        <Container style={spring}>
            <MealCreationForm />
            <Wrapper>
                <FiltersComponent applyFilter={applyFilter} filter={filterData.filter} />
            </Wrapper>
            {/* Overlay */}
            <MealEditOverlay
                mealEdited={editFormData.mealEdited}
                onUpdateMeal={onUpdateMeal}
                onDeleteMeal={onDeleteMeal}
                hideFunc={hideMealOverlay}
                isOpen={editFormData.show}
                formImage={editFormData.formImage}
            />
            <MealList meals={filterData.meals} showMealOverlay={showMealOverlay} />
        </Container>
    )
}

export default MealsManager
