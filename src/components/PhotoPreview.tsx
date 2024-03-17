import * as ExifReader from 'exifreader';
import React, {forwardRef} from 'react';

type PhotoPreviewProps = React.HTMLAttributes<HTMLDivElement> & {
    file: File,
    tags: ExifReader.Tags
}

export default forwardRef(function PhotoPreview(props: PhotoPreviewProps, ref: React.ForwardedRef<HTMLDivElement>) {
    const makerModel = [props.tags.Make?.description, props.tags.Model?.description]
        .filter((host) => host != undefined)

    const host = props.tags.HostComputer?.description ??
    makerModel.length > 0 ? makerModel.join(' ') :
        props.tags['Device Manufacturer']?.description

    const focalLength = props.tags.FocalLengthIn35mmFilm?.description?.toString()
    const fNumber = props.tags.FNumber?.description
    const shutterSpeed = props.tags.ShutterSpeedValue?.description
    const isoSpeed = props.tags.ISOSpeedRatings?.description

    return (
        <div className='max-w-3xl p-8 bg-white' ref={ref}>
            <img className='w-full' src={URL.createObjectURL(props.file)} alt=""/>
            <div className='mt-6 text-center font-extralight text-lg leading-loose'>
                {host && <h3>Shot on <strong className='font-bold'>{host}</strong></h3>}
                <p className="text-xs">
                    {focalLength && <span className='mr-2'>{focalLength}mm</span>}
                    {fNumber && <span className='mr-2'>&#119891;/{fNumber.replace(/f\//g, '')}</span>}
                    {shutterSpeed && <span className='mr-2'>{shutterSpeed}s</span>}
                    {isoSpeed && <span className='mr-2'>ISO{isoSpeed}</span>}
                </p>
            </div>
        </div>
    )
})