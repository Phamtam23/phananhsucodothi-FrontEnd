import {
    Video,
    Eye,
    Image as ImageIcon
} from "lucide-react";

import { API_CONFIG }
    from "../../constants/app.constants";

type Media = {
    url: string;
};

type Props = {
    medias: Media[];
};

const KetQuaMediaGrid = ({ medias }: Props) => {
    const isVideo = (
        url: string
    ) => {
        return url.match(
            /\.(mp4|mov|avi|wmv|flv|mkv|webm)$/i
        );
    };

    return (
        <div className="ketqua-media">
            <p className="ketqua-media__title">

                <ImageIcon size={16} />

                Minh chứng đính kèm

            </p>

            <div className="ketqua-media__slider-wrapper">

                <div className="ketqua-media__slider">

                    {medias.map((media, index) => (

                        <a
                            key={index}
                            href={`${API_CONFIG.BASE_URL}${media.url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ketqua-media__slide"
                        >

                            {isVideo(media.url) ? (

                                <div className="ketqua-media__video">

                                    <video
                                        src={`${API_CONFIG.BASE_URL}${media.url}`}
                                    />

                                    <div className="overlay">

                                        <Video size={20} />

                                    </div>

                                </div>

                            ) : (

                                <div className="ketqua-media__image">

                                    <img
                                        src={`${API_CONFIG.BASE_URL}${media.url}`}
                                        alt={`media-${index}`}
                                    />

                                    <div className="overlay">

                                        <Eye size={18} />

                                    </div>

                                </div>

                            )}

                        </a>

                    ))}

                </div>

            </div>
        </div>
    );
}
export default KetQuaMediaGrid;