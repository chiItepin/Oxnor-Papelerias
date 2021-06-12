import React, { FunctionComponent } from "react";
import { Button, Pane } from "evergreen-ui";
import { Carousel } from "react-responsive-carousel";
import { IBanner } from "../../containers/admin/templates";
import "react-responsive-carousel/lib/styles/carousel.min.css";

interface IProps {
  banners: IBanner[];
}

const MainBanners: FunctionComponent<IProps> = ({ banners }: IProps) => {
  return (
    <>
      {banners.length !== 0 && (
        <Carousel
          showArrows
          swipeable
          autoPlay
          dynamicHeight
          showThumbs={false}
        >
          {banners.map((banner) => (
            <div key={banner.key}>
              <Pane position="absolute" bottom={50} width="100%">
                {banner.buttonLink && (
                  <a target="_blank" rel="noreferrer" href={banner.buttonLink}>
                    <Button size="large" appearance="primary">
                      Ver más
                    </Button>
                  </a>
                )}
              </Pane>
              <img src={banner.image ? banner.image : ""} alt={banner.name} />
            </div>
          ))}
        </Carousel>
      )}
    </>
  );
};

export default MainBanners;
