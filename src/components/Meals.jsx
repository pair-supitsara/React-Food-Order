
import MealItem from './MealItem.jsx'
import useHttp from '../hooks/useHttp.jsx'
import Error from './Error.jsx'

const configRequest = {}
function Meals() {
    const { 
            data: loadedMeals
            , isLoading
            , error 
    } = useHttp('http://localhost:3000/meals', configRequest, [])

    if (isLoading) {
        return <p>fetching meals...</p>
    }

    if (error) {
        return <Error title='fail to fetch meals' message={error} />
    }

    return (
        <ul id="meals">
            {loadedMeals.map((meal) => {
                return (
                    <MealItem key={meal.id} meal={meal} />
                )
            })}
        </ul>
    )
}

export default Meals