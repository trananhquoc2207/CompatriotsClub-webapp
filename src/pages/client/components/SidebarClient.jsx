import React from "react";

const SidebarClient = () => {
    return (
        <>
         <div className="w3-col l4 highlight">
        <div className="w3-white w3-margin">
            <div className="w3-container w3-padding w3-black">
                <h4>Vị trí</h4>
            </div>
            <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d15678.890904616!2d106.66003772210733!3d10.755839632100946!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1svi!2s!4v1632504656563!5m2!1svi!2s" allowFullScreen="" loading="lazy"></iframe>
        </div>

        <div className="w3-white w3-margin list-contact">
            <div className="w3-container w3-padding w3-black">
                <h4>Danh sách ban liên lạc</h4>
            </div>
            
            <ul className="w3-ul w3-hoverable w3-white">
                <li><a href="">BLL Thành phố</a></li>
                <li><a href="">BLL Huyện 1</a></li>
                <li><a href="">BLL Huyện 2</a></li>
                <li><a href="">BLL Huyện 3</a></li>
                <li><a href="">BLL Huyện 4</a></li>
                <li><a href="">BLL Huyện 5</a></li>
                <li><a href="">BLL Huyện 6</a></li>
                <li><a href="">BLL Huyện 7</a></li>
                <li><a href="">BLL Huyện 8</a></li>
            </ul>
        </div>
        <div className="w3-white w3-margin">
            <div className="w3-container w3-padding w3-black">
                <h4>Bài viết phổ biến</h4>
            </div>
            <ul className="w3-ul w3-hoverable w3-white">
                <li className="w3-padding-16">
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT55hY0xM_Wh9GPe59bOrVpctiq9jQTerFS3A&usqp=CAU" alt="Image" className="w3-left w3-margin-right" />
                    <span className="w3-large">Denim</span>
                    <span>Sed mattis nunc</span>
                </li>
                <li className="w3-padding-16">
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2YncI2jfwX5zsmQQrM2q3avZMwo-xIoYbiQ&usqp=CAU" alt="Image" className="w3-left w3-margin-right" />
                    <span className="w3-large">Sweaters</span>
     
                    <span>Praes tinci sed</span>
                </li>
                <li className="w3-padding-16">
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReNgOkZvxt7DauPy4qiPitZt-3cxLM7RSqFQ&usqp=CAU" alt="Image" className="w3-left w3-margin-right" />
                    <span className="w3-large">Workshop</span>
               
                    <span>Ultricies congue</span>
                </li>
                <li className="w3-padding-16">
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyXgXzJnNvTQ7yBaZzSiLvgYtII6HZOSMQaQ&usqp=CAU" alt="Image" className="w3-left w3-margin-right w3-sepia" />
                    <span className="w3-large">Trends</span>
                    <span>Lorem ipsum dipsum</span>
                </li>
            </ul>
        </div>

        <div className="w3-white w3-margin">
            <div className="w3-container w3-padding w3-black">
                <h4>Quảng cáo</h4>
            </div>
            <div className="w3-container w3-white">
                <div className="w3-container w3-display-container w3-light-grey w3-section">
                    <span className="w3-display-middle">Your AD Here</span>
                </div>
            </div>
        </div>

        <div className="w3-white w3-margin tags">
            <div className="w3-container w3-padding w3-black">
                <h4>Thể loại bài viết</h4>
            </div>
            <div className="w3-container w3-white tag">
                <p>
                    <span className="w3-tag w3-black w3-margin-bottom">Hoạt động</span> <span className="w3-tag w3-light-grey w3-small w3-margin-bottom">Tin tức</span> <span className="w3-tag w3-light-grey w3-small w3-margin-bottom">Sự kiện</span>
                    <span className="w3-tag w3-light-grey w3-small w3-margin-bottom">Đời sống</span> <span className="w3-tag w3-light-grey w3-small w3-margin-bottom">Du lịch</span> <span className="w3-tag w3-light-grey w3-small w3-margin-bottom">Văn hóa</span>
                    <span className="w3-tag w3-light-grey w3-small w3-margin-bottom">Lịch sử</span> <span className="w3-tag w3-light-grey w3-small w3-margin-bottom">Từ thiện</span> <span className="w3-tag w3-light-grey w3-small w3-margin-bottom">Đặc sản</span>
                    <span className="w3-tag w3-light-grey w3-small w3-margin-bottom">Xã hội</span> <span className="w3-tag w3-light-grey w3-small w3-margin-bottom">Giáo dục</span> <span className="w3-tag w3-light-grey w3-small w3-margin-bottom">Phát triển</span>
                    <span className="w3-tag w3-light-grey w3-small w3-margin-bottom">Học bổng</span> <span className="w3-tag w3-light-grey w3-small w3-margin-bottom">Kỉ niệm</span>
                </p>
            </div>
        </div>


        <div className="w3-white w3-margin Inspiration">
            <div className="w3-container w3-padding w3-black">
                <h4>Hình ảnh</h4>
            </div>
            <div className="w3-row-padding w3-white list-image">
                <div className="w3-col s6 rrow">
                    <p><img src="http://imgs.vietnamnet.vn/Images/vnn/2014/11/15/16/20141115164748-1.jpg"  alt="" className='a'/></p>

                    <p><img src="https://sgp1.digitaloceanspaces.com/tz-mag-vn/wp-content/uploads/2019/12/101012124444/bai-bien-dep-nhat-viet-nam-6.jpg"/></p>
                </div>
                <div className="w3-col s6 rrow">
                    <p><img src="https://vegiagoc.com/Upload/images/hfyfjyvh.png" className="w3-grayscale"/></p>
                    <p><img src="https://cdn3.ivivu.com/2016/06/du-lich-kon-tum-ivivu-2.jpg"/></p>
                </div>
            </div>
        </div>

        <div className="w3-white w3-margin">
            <div className="w3-container w3-padding w3-black">
                <h4>Follow Me</h4>
            </div>
            <div className="w3-container w3-xlarge w3-padding">
                <i className="fa fa-facebook-official w3-hover-opacity"></i>
                <i className="fa fa-instagram w3-hover-opacity"></i>
                <i className="fa fa-snapchat w3-hover-opacity"></i>
                <i className="fa fa-pinterest-p w3-hover-opacity"></i>
                <i className="fa fa-twitter w3-hover-opacity"></i>
                <i className="fa fa-linkedin w3-hover-opacity"></i>
               
            </div>
        </div>
    </div>
</>
    )
}
export default SidebarClient;