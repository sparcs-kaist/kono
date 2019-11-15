import React, { useState, useEffect } from 'react';
import { LostFoundPanelDesktop, LostFoundPanelMobile } from 'components/landing';
import * as ImageAPI from 'api/image';
import Text from 'res/texts/LostFoundPanel.text.json';
import { useWindowDimension, useLanguages, useFetch } from 'lib/hooks'

export default () => {

    const [currentPage, setCurrentPage] = useState(1);
    const { width } = useWindowDimension();

    const showDesktopLayout = width >= 800;
    const showNarrowLayout = width < 1080;
    
    const [pagination, setPagination] = useState(0);

    const [
        numImages,
        fetchNumImages,
        , // isLoading
        isErrorNumImages,
        ,
    ] = useFetch(0);

    const [
        images,
        fetchImages,
        , // isLoading
        isErrorImages,
        ImagesErrorHandler
    ] = useFetch([]);

    const [imageList, setImageList] = useState([]);

    const [text] = useLanguages(Text);

    const numPages = Math.max(1, Math.ceil(numImages / pagination));
    const imageURLs = showDesktopLayout
        ? images.map(image => image.url)
        : imageList.map(image => image.url);
    const imageLinks = showDesktopLayout
        ? images.map(image => `/post/${image.post_sid}`)
        : imageList.map(image => `/post/${image.post_sid}`);

    const isError = isErrorNumImages || isErrorImages;
    const ErrorHandlerComponent = ImagesErrorHandler;

    useEffect(() => {
        fetchNumImages(ImageAPI.count, [], data => data.lostfound);
    }, [fetchNumImages])

    const setCurrentPageWithSideEffect = (value) => {
        setCurrentPage(value);
        if (pagination > 0)
            fetchImages(
                ImageAPI.list, 
                [{
                    params: {
                        filter_type: 'lostfound',
                        start_index: (value - 1) * pagination,
                        max_size: pagination
                    }
                }]
            );
    }

    useEffect(() => {
        const fetchInitialImages = () => {
            setCurrentPage(1);
            if (pagination > 0)
                fetchImages(
                    ImageAPI.list,
                    [{
                        params: {
                            filter_type: 'lostfound',
                            max_size: pagination
                        }
                    }]
                );
        };
        setImageList([]);
        fetchInitialImages();
    }, [fetchImages, pagination]);

    useEffect(() => {
        setImageList(imageList => imageList.concat(images));
    }, [images])

    return showDesktopLayout ? (
        <LostFoundPanelDesktop
            imageURLs={imageURLs}
            imageLinks={imageLinks}
            numPages={numPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPageWithSideEffect}
            isError={isError}
            ErrorHandler={ErrorHandlerComponent}
            text={text}
            showNarrowLayout={showNarrowLayout}
            setPagination={setPagination}
        />
    ) : (
        <LostFoundPanelMobile
            imageURLs={imageURLs}
            imageLinks={imageLinks}
            numPages={numPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPageWithSideEffect}
            isError={isError}
            ErrorHandler={ErrorHandlerComponent}
            text={text}
            showNarrowLayout={showNarrowLayout}
            setPagination={setPagination}
        />
    )

}