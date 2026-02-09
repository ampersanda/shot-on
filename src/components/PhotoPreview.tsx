import * as ExifReader from 'exifreader';
import React, {forwardRef, useEffect, useState} from 'react';

type PhotoPreviewProps = React.HTMLAttributes<HTMLDivElement> & {
    file: File,
    tags: ExifReader.Tags
}

export default forwardRef(function PhotoPreview(props: PhotoPreviewProps, ref: React.ForwardedRef<HTMLDivElement>) {
    const [objectUrl, setObjectUrl] = useState<string>('')

    useEffect(() => {
        const url = URL.createObjectURL(props.file)
        setObjectUrl(url)
        return () => URL.revokeObjectURL(url)
    }, [props.file])

    const makerModel = [props.tags.Make?.description, props.tags.Model?.description]
        .filter((host) => host != undefined)

    const host = props.tags.HostComputer?.description ??
        (makerModel.length > 0 ? makerModel.join(' ') :
            props.tags['Device Manufacturer']?.description)

    const focalLength = props.tags.FocalLengthIn35mmFilm?.description?.toString()
    const fNumber = props.tags.FNumber?.description
    const shutterSpeed = props.tags.ShutterSpeedValue?.description
    const isoSpeed = props.tags.ISOSpeedRatings?.description

    const hostBeautified = (host ?? '')
        .replace(/^samsung/g, 'Samsung')
        .replace(/^(\w+)\s\1/g, '$1')

    return (
        <figure className='max-w-3xl p-8 bg-white' ref={ref}>
            {objectUrl && <img className='w-full' src={objectUrl} alt="Selected photo"/>}
            <figcaption className='mt-3 text-center font-extralight text-lg leading-loose'>
                {host && <h3>Shot on <strong className='font-bold'>{hostBeautified}</strong></h3>}
                <p className="text-xs">
                    {focalLength && <span className='mr-2'>{focalLength}mm</span>}
                    {fNumber && <span className='mr-2'>&#119891;/{fNumber.replace(/f\//g, '')}</span>}
                    {shutterSpeed && <span className='mr-2'>{shutterSpeed}s</span>}
                    {isoSpeed && <span className='mr-2'>ISO{isoSpeed}</span>}
                </p>
            </figcaption>
        </figure>
    )
})
