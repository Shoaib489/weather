import React, { useEffect, useState } from 'react';
import classes from './tempertaure.module.css';
import {
    IconDropletOff,
    IconTemperatureCelsius,
    IconTemperatureMinus,
    IconTemperaturePlus,
    IconWind,
    IconTrash,
    IconSearch
} from '@tabler/icons-react';

const Temperature = () => {
    const [city, setCity] = useState(null);
    const [search, setSearch] = useState("");
    const [query, setQuery] = useState("");
    const [searchHistory, setSearchHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
        setSearchHistory(savedHistory);

        const savedCity = JSON.parse(localStorage.getItem('city'));
        if (savedCity) {
            setCity(savedCity);
            setSearch(savedCity.name);
            setQuery(savedCity.name);
        }

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
                },
                (error) => {
                    console.error("Error getting location:", error);
                    setLoading(false);
                }
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (query) {
            fetchWeather(query);
        }
    }, [query]);

    const fetchWeather = async (location) => {
        setLoading(true);
        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=57b4c2c960a072409006c94821a5795e&units=metric`;
            const response = await fetch(url);
            const data = await response.json();

            if (data.main) {
                const cityData = {
                    name: location,
                    weatherId: data.weather[0]?.id || '',
                    weatherIcon: data.weather[0]?.icon || '',
                    weatherDescription: data.weather[0]?.description || '',
                    temp: data.main.temp,
                    temp_min: data.main.temp_min,
                    temp_max: data.main.temp_max,
                    humidity: data.main.humidity,
                    wind_speed: data.wind.speed,
                };

                setCity(cityData);
                localStorage.setItem('city', JSON.stringify(cityData));

                setSearchHistory((prevHistory) => {
                    if (!prevHistory.some(entry => entry.name.toLowerCase() === location.toLowerCase())) {
                        const newHistory = [...prevHistory, cityData];
                        localStorage.setItem('searchHistory', JSON.stringify(newHistory));
                        return newHistory;
                    }
                    return prevHistory;
                });
            } else {
                setCity(null);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        setLoading(false);
    };

    const fetchWeatherByCoords = async (lat, lon) => {
        setLoading(true);
        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=57b4c2c960a072409006c94821a5795e&units=metric`;
            const response = await fetch(url);
            const data = await response.json();

            if (data.main) {
                const cityData = {
                    name: data.name,
                    weatherId: data.weather[0]?.id || '',
                    weatherIcon: data.weather[0]?.icon || '',
                    weatherDescription: data.weather[0]?.description || '',
                    temp: data.main.temp,
                    temp_min: data.main.temp_min,
                    temp_max: data.main.temp_max,
                    humidity: data.main.humidity,
                    wind_speed: data.wind.speed,
                };

                setCity(cityData);
                localStorage.setItem('city', JSON.stringify(cityData));

                setSearchHistory((prevHistory) => {
                    if (!prevHistory.some(entry => entry.name.toLowerCase() === data.name.toLowerCase())) {
                        const newHistory = [...prevHistory, cityData];
                        localStorage.setItem('searchHistory', JSON.stringify(newHistory));
                        return newHistory;
                    }
                    return prevHistory;
                });
            } else {
                setCity(null);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        setLoading(false);
    };

    const getBackground = (description) => {
        console.log('Weather description:', description);
        if (description?.includes('clear')) return '/images/clearSky.jpg';
        if (description?.includes('overcast clouds')) return "https://images.pexels.com/photos/4765251/pexels-photo-4765251.jpeg";
        if (description?.includes('scattered clouds')) return 'https://images.unsplash.com/photo-1706172998833-86583ccf89c6?q=80&w=1934&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
        if (description?.includes('broken clouds')) return '/images/cloudySky.jpg';
        if (description?.includes('light rain')) return 'https://m.economictimes.com/thumb/msid-106065716,width-1600,height-900,resizemode-4,imgsize-222700/tamil-nadu-rain.jpg';
        if (description?.includes('moderate rain')) return 'https://m.economictimes.com/thumb/msid-106065716,width-1600,height-900,resizemode-4,imgsize-222700/tamil-nadu-rain.jpg';
        if (description?.includes('heavy intensity rain')) return 'https://st4.depositphotos.com/1016729/37888/i/450/depositphotos_378884654-stock-photo-riving-car-flooded-road-flood.jpg';
        if (description?.includes('thunderstorm')) return '/images/thunderstorm.jpg';
        if (description?.includes('snow')) return '/images/snow.jpg';
        if (description?.includes('fog')) return 'https://images7.alphacoders.com/660/660728.jpg';
        if (description?.includes('haze')) return '/images/haze.jpg';
        if (description?.includes('mist')) return '/images/haze.jpg';
        if (description?.includes('drizzle')) return 'https://m.economictimes.com/thumb/msid-106065716,width-1600,height-900,resizemode-4,imgsize-222700/tamil-nadu-rain.jpg';
        return "https://pics.freeartbackgrounds.com/fullhd/Rural_Meadow_Landscape_Background-900.jpg";
    };

    const getTemperatureColor = (temp) => {
        if (temp >= 38) return "red";
        if (temp >= 29) return "#E8960D";
        if (temp >= 20) return "#93F0D8";
        return "blue";
    };

    const handleDelete = (cityName) => {
        setSearchHistory((prevHistory) => {
            const updatedHistory = prevHistory.filter(entry => entry.name.toLowerCase() !== cityName.toLowerCase());
            localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
            return updatedHistory;
        });
    };

    const handleHistoryClick = (historyItem) => {
        setCity(historyItem);
        setSearch(historyItem.name);
        setQuery(historyItem.name);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            setQuery(search);
        }
    };

    return (
        <div className={classes.mainflex} style={{ backgroundImage: `url(${getBackground(city?.weatherDescription)})`, backgroundSize: 'cover', backgroundPosition: "center", }}>
            <div className={classes.tempSearch}>
                <div className='flex justify-center gap-3 capitalize'>
                    <input
                        className={`${classes.styleInput} capitalize`}
                        type="text"
                        value={search}
                        placeholder='Search City Temperature ...'
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                    <button
                        className='bg-white rounded-full h-[40px] w-[40px] flex justify-center items-center capitalize border-[3px] border-gray-400'
                        onClick={() => setQuery(search)}
                    >
                        <IconSearch stroke={2} className='w-[20px] h-[20px] text-[grey]' />
                    </button>
                </div>
                {loading ? (
                    <p>Loading...</p>
                ) : city ? (
                    <div>
                        <div className='flex items-center justify-center'>
                            <span style={{ color: getTemperatureColor(city.temp), fontSize: "55px", fontWeight: "700" }}>
                                {city.temp}
                                <IconTemperatureCelsius stroke={1.5} className='inline w-[50px] h-[55px]' />
                            </span>
                        </div>
                        <h1 className={classes.capitals}>{city.name}</h1>
                        <div className='flex items-center justify-center m-2 '>
                            <img src={`https://openweathermap.org/img/wn/${city.weatherIcon}.png`} alt="" width={"80px"} />
                            <h2 className='capitalize text-white'>{city.weatherDescription}</h2>
                        </div>
                        <div className='flex flex-wrap justify-between'>
                            <div className='text-center w-[48%] md:w-[160px] rounded-md shadow-lg bg-[#ffffff1b] backdrop-blur-md mb-2 md:mb-0'>
                                <p className='text-[15px] font-bold text-[#de3535]'>Max Temp</p>
                                <div className='flex justify-between p-2'>
                                    <IconTemperaturePlus stroke={2} color='red' />
                                    <p className='font-semibold  text-[#ffffffc1]'>{city.temp_max}°C</p>
                                </div>
                            </div>
                            <div className='text-center w-[48%] md:w-[160px] rounded-md shadow-lg backdrop-blur-md bg-[#ffffff13]'>
                                <p className='text-[15px] font-bold text-[#359dde]'>Min Temp</p>
                                <div className='flex justify-between p-2'>
                                    <IconTemperatureMinus stroke={2} color='#359dde' />
                                    <p className='font-semibold text-[#ffffffb6]'>{city.temp_min}°C</p>
                                </div>
                            </div>
                        </div>
                        <div className='flex flex-wrap justify-between mt-3'>
                            <div className='text-center w-[48%] md:w-[160px] rounded-md shadow-lg backdrop-blur-md bg-[#ffffff14] mb-2 md:mb-0'>
                                <p className='text-[15px] font-bold text-[#E8960D]'>Humidity</p>
                                <div className='flex justify-between p-2'>
                                    <IconDropletOff stroke={2} color='#E8960D' />
                                    <p className='font-semibold  text-[#ffffffbc]'>{city.humidity} g/m³</p>
                                </div>
                            </div>
                            <div className='text-center w-[48%] md:w-[160px] rounded-md shadow-lg backdrop-blur-md bg-[#ffffff0c]'>
                                <p className='text-[15px] font-bold text-[#cccccc]'>Wind Speed</p>
                                <div className='flex justify-between p-2'>
                                    <IconWind stroke={2} className='text-[#cbcbcb]' />
                                    <p className='font-semibold  text-[#ffffffb6]'>{city.wind_speed} km/h</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p>No data found</p>
                )}
            </div>
            <div className={classes.movetobottom}>
                {searchHistory.length  > 0 && (
                    <div className={` ${classes.changesavedata}flex capitalize gap-4 text-[14px] absolute right-[30px] top-[30px] w-[90%] flex-wrap justify-end`}>
                        {searchHistory.slice(-8).map((historyItem, index) => (
                            <div
                                key={index}
                                className={`${classes.saveData} p-4 rounded shadow w-[300px] flex-col cursor-pointer`}
                                onClick={() => handleHistoryClick(historyItem)}
                            >
                                <div className='flex justify-between items-center'>
                                    <h3 className='capitalize text-[18px] font-semibold underline'>{historyItem.name}</h3>
                                    <button
                                        className='text-red-500'
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(historyItem.name);
                                        }}>
                                        <IconTrash stroke={1.5} className='w-[20px]' />
                                    </button>
                                </div>
                                <p>
                                    Temperature: <span className='font-semibold' style={{ color: getTemperatureColor(historyItem.temp) }}>{historyItem.temp} °C</span>
                                </p>
                                <p>Description: {historyItem.weatherDescription}</p>
                                <p>Humidity: {historyItem.humidity} g/m³</p>
                                <p>Wind Speed: {historyItem.wind_speed} km/h</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Temperature;
