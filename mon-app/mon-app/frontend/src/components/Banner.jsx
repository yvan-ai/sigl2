/**
 *
 * @param {{
 *  img: string
 * }} props
 * @returns
 */
const Banner = ({ img }) => {
    return (
        <img
            className="h-72 md:h-80 lg:h-96 w-full rounded-2xl object-cover drop-shadow-md"
            src={img}
        ></img>
    );
};

export default Banner;
