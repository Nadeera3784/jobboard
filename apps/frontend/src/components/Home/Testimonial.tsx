import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Star } from 'lucide-react';
import UserAvatar from '../../assets/images/user_1.jpg';

const Testimonial = () => {
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const feedbacks = [
    {
      name: 'Calvin Carlo',
      title: 'Manager',
      comment:
        'It seems that only fragments of the original text remain in the Lorem Ipsum texts used today.',
    },
    {
      name: 'Christa Smith',
      title: 'Manager',
      comment:
        'The most well-known dummy text is the Lorem Ipsum, which is said to have originated in the 16th century.',
    },
    {
      name: 'Jemina CLone',
      title: 'Manager',
      comment:
        'One disadvantage of Lorum Ipsum is that in Latin certain letters appear more frequently than others.',
    },
    {
      name: 'Smith Vodka',
      title: 'Manager',
      comment:
        'Thus, Lorem Ipsum has only limited suitability as a visual filler for German texts.',
    },
    {
      name: 'Cristino Murfi',
      title: 'Manager',
      comment:
        'There is now an abundance of readable dummy texts. These are usually used when a text is required.',
    },
  ];

  return (
    <section className="bg-white">
      <div className="container xl:max-w-7xl mx-auto px-4 py-16 lg:px-8 lg:py-32">
        <div className="text-center mb-5">
          <h1 className="text-5xl tracking-tight font-extrabold text-gray-900 mb-2">
            What Our Users Say
          </h1>
          <p className="text-lg">
            Search all the open positions on the web. Get your own personalized
            salary <br /> estimate. Read reviews on over 30000+ companies
            worldwide.
          </p>
        </div>
        <div className="text-center w-full">
          <Slider {...settings}>
            {feedbacks.map((feedback, index) => (
              <div className="text-center relative" key={index}>
                <div className="cursor-e-resize">
                  <div className="content relative rounded shadow  m-2 p-6 bg-white  before:content-[''] before:absolute before:start-1/2 before:-bottom-[4px] before:box-border before:border-8 before:rotate-[45deg] before:border-t-transparent before:border-e-white  before:border-b-white before:border-s-transparent before:shadow-testi  before:origin-top-left">
                    <p className="text-slate-400">{feedback.comment}</p>
                    <div className="flex items-center justify-center mt-3">
                      <Star className="w-4 h-4 text-amber-400 ms-1" />
                      <Star className="w-4 h-4 text-amber-400 ms-1" />
                      <Star className="w-4 h-4 text-amber-400 ms-1" />
                      <Star className="w-4 h-4 text-amber-400 ms-1" />
                      <Star className="w-4 h-4 text-amber-400 ms-1" />
                    </div>
                  </div>
                  <div className="text-center mt-5">
                    <img
                      src={UserAvatar}
                      className="size-14 rounded-full shadow-md mx-auto"
                      alt="user_avatar"
                    />
                    <h6 className="mt-2 font-semibold"> {feedback.name}</h6>
                    <span className="text-slate-400 text-sm">
                      {feedback.title}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
};
export default Testimonial;
