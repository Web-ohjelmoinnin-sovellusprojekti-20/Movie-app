import { Pagination } from "react-bootstrap"

export default function PaginationComp({total, current, onChange}) {
    
    let items = []

    /*if (current >= 1) {
        items.push(<Pagination.Prev key="prev" onClick={() => onChange(current - 1)}/>)
    }*/

    for (let page = 1; page <= total; page++) {
        items.push(
            <Pagination.Item key={page} data-page={page} active={page === current} onClick={() => onChange(page)}>
                {page}
            </Pagination.Item>
        )
    }

    /*if (current <= total) {
        items.push(<Pagination.Next key="next" onClick={() => onChange(current + 1)}/>)
    }*/

    return (
        <Pagination>{items}</Pagination>
    )
}