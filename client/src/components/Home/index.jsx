import { /*Link,*/ NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  getDogs,
  getTemperaments,
  filterByTemperament,
  filterByCreated,
  orderByName,
  orderByWeight,
} from "../../actions";

import OneDog from "../OneDog/index";
import Paging from "../Paging/index.jsx";
import SearchBar from "../SearchBar/index.jsx";
import Styles from "./index.module.css";
import Loader from "../Loader/loader";

export default function Home() {
  const dispatch = useDispatch();

  var razas = useSelector((state) => state.dogs); //me traigo los Dogs del estado

  const allTemps = useSelector((state) => state.temps); //me traigo los temperamentos del Estado
  const [Loadin, setLoadin] = useState (false)

  useEffect(() => {
    setLoadin(true)
    setTimeout(() =>{
      setLoadin(false)
    }, 1000)
    
  },[])
  
  //paginado
  const [pagActual, setPagActual] = useState(1);
  const dogsPorPag = 8;
  const indUltimoDog = pagActual * dogsPorPag;
  const indPrimerDog = indUltimoDog - dogsPorPag;
  const currentDogs = razas.slice(indPrimerDog, indUltimoDog);

  const paginado = (nroPag) => {
    setPagActual(nroPag);
  };

  //Para disparar la accion getDogs(), y llenar el Estado con los dogs
  useEffect(() => {
    dispatch(getDogs());
  }, [dispatch]);

  //Para disparar la accion getTemps(), y llenar el estado con los temperamentos
  useEffect(() => {
    dispatch(getTemperaments());
  }, [dispatch]);

  //funcion para tomar el select de temperamentos y despachar la accion de filtrar temp, para renderizar los dogs fitrados
  function handleFilterTemp(event) {
    dispatch(filterByTemperament(event.target.value));
    setPagActual(1);
  }

  //funcion para tomar el select de Razas Todas / Creadas / Existentes y despachar la accion filterByCreated
  function handleFilterCreated(e) {
    dispatch(filterByCreated(e.target.value));
    setPagActual(1);
  }

  // funcion para ordenar las razas en orden asc o desc cdo se selecciona el select, y despacha la accion orderByName
  function handleABC(ev) {
    ev.preventDefault();
    dispatch(orderByName(ev.target.value));
    setPagActual(1);
  }

  //funcion para ordenar las razas x > o < peso, se despacha orderByWeight
  function handleWeight(e) {
    e.preventDefault();
    dispatch(orderByWeight(e.target.value));
    setPagActual(1);
  }

  return (
    <div>
    {
      Loadin ?
      <Loader
      size={150}
      Loadin={Loadin}
      />
      :
     <nav className={Styles.body}>
      
         
          <div className={Styles.containers}>
            <select
              className={Styles.select}
              name="created"
              onChange={(e) => handleFilterCreated(e)}
            >
              <option className={Styles.options} value="All" key="3">
                Todas las razas
              </option>
              <option className={Styles.options} value="razaApi" key="4">
                Razas Existentes
              </option>
              <option className={Styles.options} value="razaBD" key="5">
                Razas Creadas
              </option>
            </select>

            <select
              className={Styles.select}
              name="abcOrden"
              onChange={(ev) => handleABC(ev)}
            >
              <option className={Styles.options} value="all" key="0">
                Orden Alfabético
              </option>
              <option className={Styles.options} value="asc" key="1">
                Ascendente A-Z
              </option>
              <option className={Styles.options} value="desc" key="2">
                Descendente Z-A
              </option>
            </select>

            <select
              className={Styles.select}
              name="orderWeight"
              onChange={(e) => handleWeight(e)}
            >
              <option className={Styles.options} value="All">
                Orden Peso Promedio
              </option>
              <option className={Styles.options} value="min">
                Menor Peso
              </option>
              <option className={Styles.options} value="max">
                Mayor Peso
              </option>
            </select>

            <select
              className={Styles.select}
              name="temps"
              onChange={(event) => handleFilterTemp(event)}
            >
              <option className={Styles.options} value="All" key={100}>
                Filtro Por Temperamento
              </option>
              {allTemps.map((t) => (
                <option
                  className={Styles.options}
                  key={t.id}
                  value={t.nameTemp}
                >
                  {t.nameTemp}
                </option>
              ))}
            </select>
          </div>

          <div className={Styles.contan}>
            <NavLink className={Styles.link} to="/">
              Volver a Inicio
            </NavLink>
          <NavLink className={Styles.link} to="/newDog">
                Crear Nueva Raza
              </NavLink>
            </div>

            <div className={Styles.buscar}>
              <SearchBar />
              </div>

          
      <div className={Styles.cards}>
        {currentDogs?.map((el) => {
          return (
            <div>
              <OneDog
                id={el.id}
                name={el.name}
                temperament={el.temperament}
                image={el.image ? el.image : "imagen no encontrada"}
                weight={el.weight}
              />
            </div>
          );
        })}
      </div>
      <div>
        <Paging
          dogsPorPag={dogsPorPag}
          allDogs={razas.length}
          paginado={paginado}
        />
      </div>

    </nav>
}
    </div>
  );
}
