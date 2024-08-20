import { Link } from "react-router-dom";

export default function ExploreArtistKit() {
  return (
    <div className="w-full pt-5 px-16">
      <h4 className="text-2xl font-semibold mb-8 dark:text-white">
        Explore Our Artist's Kit
      </h4>
      <Link to={"/artistKit"}>
        <div
          className="w-full h-80 relative bg-center bg-cover group rounded"
          style={{
            backgroundImage:
              "url('https://static.vecteezy.com/system/resources/previews/002/090/200/non_2x/summer-music-day-festival-banner-free-vector.jpg')",
          }}
        >
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-300 z-0 "></div>
          <div className="absolute bottom-0 left-0 px-5 py-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
            <span className="text-darkText text-2xl font-medium">
              Share your voice with the world
            </span>
            <br />
            <span className="text-darkTextSecondary">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
              tincidunt, nisi id auctor egestas, erat sapien eleifend ex, at
              elementum elit tellus eu est. Cras molestie felis eget laoreet
              molestie. Nam eget maximus nisi.
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
