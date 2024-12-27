"use client"
import { setRoutePaths } from '@/features/redux/routePath/routePath';
import { NextPage } from 'next'
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

interface Props {}

const RoutePaths: NextPage<Props> = ({}) => {
    const {paths} = useSelector((state:any)=>state.routePaths)
    const pathName = usePathname()
    const dispatch = useDispatch()

    useEffect(() => {
        if (paths[-1] !== pathName){
            dispatch(setRoutePaths([...paths, pathName]))
        }
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [pathName]);
    
  return (
  <>

  </>
)
}

export default RoutePaths