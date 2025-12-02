// Модуль для работы с корзиной
const CartManager = {
    key: 'bookworm_cart',
    
    getCart() {
        return JSON.parse(localStorage.getItem(this.key)) || [];
    },
    
    saveCart(cart) {
        localStorage.setItem(this.key, JSON.stringify(cart));
        this.updateCartCount();
    },
    
    addToCart(book, quantity = 1) {
        const cart = this.getCart();
        const existingItem = cart.find(item => item.id === book.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                ...book,
                quantity: quantity
            });
        }
        
        this.saveCart(cart);
        this.showNotification('Книга добавлена в корзину!');
    },
    
    removeFromCart(bookId) {
        const cart = this.getCart().filter(item => item.id !== bookId);
        this.saveCart(cart);
    },
    
    updateQuantity(bookId, quantity) {
        const cart = this.getCart();
        const item = cart.find(item => item.id === bookId);
        
        if (item) {
            if (quantity <= 0) {
                this.removeFromCart(bookId);
            } else {
                item.quantity = quantity;
                this.saveCart(cart);
            }
        }
    },
    
    getTotalItems() {
        return this.getCart().reduce((total, item) => total + item.quantity, 0);
    },
    
    getTotalPrice() {
        return this.getCart().reduce((total, item) => total + (item.price * item.quantity), 0);
    },
    
    updateCartCount() {
        const countElements = document.querySelectorAll('#cart-count');
        countElements.forEach(el => {
            el.textContent = this.getTotalItems();
        });
    },
    
    showNotification(message) {
        // Создаем уведомление
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--primary-color);
            color: white;
            padding: 1rem;
            border-radius: 4px;
            z-index: 10000;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    },
    
    clearCart() {
        localStorage.removeItem(this.key);
        this.updateCartCount();
    }
};

// Модуль для работы с книгами
const BookManager = {
    // База данных книг (простая статическая коллекция для примера)
    books: [
        {
            id: 1,
            title: 'Беседа с богом странствий',
            author: 'Рюноскэ Акутагава',
            price: 249,
            oldPrice: 299,
            image: 'images/books/beseda.jpg',
            category: 'Японская литература',
            rating: 4.6,
            description: 'Если есть желание понять японскую душу и ментальность — надо читать малую прозу Акутагавы Рюноскэ. Читать неторопливо и вдумчиво и перечитывать снова и снова, улавливая намеки и подтексты и обнаруживая под чистой поверхностью потаенные глубины смыслов. В этот сборник включены произведения разных лет — новеллы и совсем короткие, по-японски лаконичные рассказы и миниатюры, в которых подразумевается (и, соответственно, прочитывается) гораздо больше, чем написано. Серьезные и ироничные, однако неизменно изящные стилизации под средневековую прозу, в которых Акутагава до сих пор не имеет себе равных среди японских писателей, грустные и ироничные сказки и притчи и тексты в более европеизированном жанре психологического реализма, неизменно преломлявшемся тем не менее автором под совершенно национальным углом...'
        },

        {
            id: 2,
            title: 'Бойцовский клуб',
            author: 'Чак Паланик',
            price: 339,
            image: 'images/books/club.jpg',
            category: 'Роман',
            rating: 4.2,
            description: '«Бойцовский клуб» – самый знаменитый роман Чака Паланика. Все помнят фильм режиссера Дэвида Финчера с Брэдом Питтом в главной роли? Он именно по этой книге. Это роман-вызов, роман, созданный всем назло и вопреки всему, в нем описывается поколение озлобившихся людей, потерявших представление о том, что можно и чего нельзя, где добро и зло, кто они сами и кто их окружает. Сам Паланик называет свой «Бойцовский клуб» новым «Великим Гэтсби». Какие же они – эти Гэтсби конца XX века?'
        },
        {
            id: 3,
            title: 'Масло',
            author: 'Асако Юзуки',
            price: 999,
            image: 'images/books/maslo.jpg',
            category: 'Детектив',
            rating: 4.8,
            description: 'Журналистка Рика загорается идеей написать серию статей о Манако Кадзии — женщине, которую подозревают в вымогательстве и убийствах собственных поклонников. Она окружала мужчин заботой и любовью, кормила домашней едой, жила на их деньги… а потом они умирали. Но общественность удивляют не столько сами преступления, сколько внешность убийцы: ее полнота никак не вяжется с образом роковой содержанки. Журналистка хочет выяснить, в чем секрет Кадзии, почему ее любили мужчины, откуда у нее такая уверенность в себе? Чтобы подступиться к загадочной преступнице, Рика просит у нее рецепт говяжьего рагу, которое один из убитых ел прямо перед смертью. В ответ женщина требует, чтобы Рика тоже начала готовить. Пытаясь втереться в доверие к Манако, журналистка не замечает, как сама оказывается в паутине манипуляций и лжи, постепенно теряя контроль над собственной жизнью…'
        },
        {
            id: 4,
            title: 'Перекресток воронов',
            author: 'Анджей Сапковский',
            price: 569,
            oldPrice: 699,
            image: 'images/books/perek.jpg',
            category: 'Фэнтези',
            rating: 4.5,
            description: 'Новая глава культовой саги «Ведьмак». Роман о молодых годах Геральта из Ривии. Цикл «Ведьмак» — классика жанра фэнтези. Закончились годы учебы, и Геральт покидает надежные стены крепости Каэр Морхен. Здесь, в обычном человеческом мире экзамены ставит жизнь и пересдать их уже не получится. Малейший промах может обрушить карьеру юного ведьмака — страшные чудовища, таящиеся в сумраке лесных зарослей, кладбищ и пустырей, не так опасны, как люди, что улыбаются тебе в лицо, замышляя предательство. Будущий Белый Волк еще очень молод, уверен в себе и полон надежд, но за каждым поворотом его караулит беда, окликая хриплым вороньим карканьем...'
        },
        {
            id: 5,
            title: 'Академическое обучение изобразительному искусству',
            author: 'В.С. Шаров',
            price: 2999,
            image: 'images/books/paint.jpg',
            category: 'Научная литература',
            rating: 4.3,
            description: 'Перед вами — учебное пособие по изобразительному искусству. Эта книга — незаменимый помощник для учащихся художественных училищ, а также для всех, кто желает постичь основы изобразительной грамоты. В пособии изложены законы и понятия из комплекса теоретических знаний, важных для овладения изобразительной грамотой. Книга включает в себя систематическое иллюстрированное изложение академического курса по рисунку, живописи, станковой композиции и пленэру на основе программ по этим дисциплинам, разработанных методическим кабинетом Московского государственного академического художественного училища памяти 1905 года для отделения «Живопись» художественных училищ и рекомендуемых Министерством культуры РФ.'
        },
        {
            id: 6,
            title: 'Зов Ктулху',
            author: 'Говард Филлипс Лавкрафт',
            price: 999,
            image: 'images/books/ktul.jpg',
            category: 'Ужасы',
            rating: 5.0,
            description: 'Дагон, Ктулху, Йог-Сотот и многие другие темные божества, придуманные Говардом Лавкрафтом в 1920-е годы, приобрели впоследствии такую популярность, что сотни творцов фантастики, включая Нила Геймана и Стивена Кинга, до сих пор продолжают расширять его мифологию. Каждое монструозное божество в лавкрафтианском пантеоне олицетворяет собой одну из бесчисленных граней хаоса. Таящиеся в глубинах океана или пребывающие в глубине непроходимых лесов, спящие в египетских пирамидах или замурованные в горных пещерах, явившиеся на нашу планету со звезд или из бездны неисчислимых веков, они неизменно враждебны человечеству и неподвластны разуму. И единственное, что остается человеку – это всячески избегать столкновения с этими таинственными существами и держаться настороже…'
        },
        {
            id: 7,
            title: 'Преступление и наказание',
            author: 'Ф.М. Достоевский',
            price: 269,
            oldPrice: 369,
            image: 'images/books/prest.jpg',
            category: 'Роман',
            rating: 4.8,
            description: 'Преступление и наказание" (1866) — одно из самых значительных произведений в истории мировой литературы. Это и глубокий филососфский роман, и тонкая психологическая драма, и захватывающий детектив, и величественная картина мрачного города, в недрах которого герои грешат и ищут прощения, жертвуют собой и отрекаются от себя ради ближних и находят успокоение в смирении, покаянии, вере. Главный герой романа Родион Раскольников решается на убийство, чтобы доказать себе и миру, что он не "тварь дрожащая", а "право имеет". Главным предметом исследования писателя становится процесс превращения добропорядочного, умного и доброго юноши в убийцу, а также то, как совершивший преступление Раскольников может искупить свою вину.'
        }
        
        
    ],

    
    
    getBooksByCategory(category) {
        return this.books.filter(book => book.category === category);
    },
    
    searchBooks(query) {
        const lowerQuery = query.toLowerCase();
        return this.books.filter(book => {
            // не показываем в результатах поиска те, которые выключены для каталога
            if (this.catalogExclusions && this.catalogExclusions.includes(book.id)) return false;
            return book.title.toLowerCase().includes(lowerQuery) ||
                book.author.toLowerCase().includes(lowerQuery);
        });
    },
    
    filterBooks(filters) {
        return this.books.filter(book => {
            // исключаем книги, которые специально не должны показываться в каталоге
            if (this.catalogExclusions && this.catalogExclusions.includes(book.id)) return false;
            if (filters.genre && filters.genre.length > 0 && !filters.genre.includes(book.category)) {
                return false;
            }
            if (filters.minPrice && book.price < filters.minPrice) {
                return false;
            }
            if (filters.maxPrice && book.price > filters.maxPrice) {
                return false;
            }
            if (filters.author && !book.author.toLowerCase().includes(filters.author.toLowerCase())) {
                return false;
            }
            return true;
        });
    },
    
    sortBooks(books, sortBy) {
        const sorted = [...books];
        switch (sortBy) {
            case 'price-asc':
                return sorted.sort((a, b) => a.price - b.price);
            case 'price-desc':
                return sorted.sort((a, b) => b.price - a.price);
            case 'rating':
                return sorted.sort((a, b) => b.rating - a.rating);
            default:
                return sorted.sort((a, b) => a.title.localeCompare(b.title));
        }
    }
    ,

    // Return latest N books based on the array order (useful for "Новинки")
    getLatestBooks(count = 4) {
        if (!Array.isArray(this.books) || this.books.length === 0) return [];
        // Возвращаем последние добавленные книги (по порядку в массиве)
        return this.books.slice(-count).reverse();
    },

    // Return top rated books
    getTopRated(count = 4) {
        return [...this.books]
            .filter(b => !(this.catalogExclusions && this.catalogExclusions.includes(b.id)))
            .sort((a, b) => b.rating - a.rating)
            .slice(0, count);
    }
};

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация корзины
    CartManager.updateCartCount();
    
    // Инициализация мобильного меню
    initMobileMenu();
    
    // Инициализация страниц
    initCurrentPage();
});

function initMobileMenu() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.main-nav');
    
    if (toggle && nav) {
        toggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            // Update accessible state on the button
            const expanded = nav.classList.contains('active');
            try { toggle.setAttribute('aria-expanded', expanded ? 'true' : 'false'); } catch(e) {}
        });

        // Close the menu when user clicks a link (mobile behavior)
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (nav.classList.contains('active')) {
                    nav.classList.remove('active');
                    try { toggle.setAttribute('aria-expanded', 'false'); } catch(e) {}
                }
            });
        });
    }
}

function initCurrentPage() {
    const path = window.location.pathname;
    const page = path.split('/').pop();
    
    switch (page) {
        case 'index.html':
        case '':
            initHomePage();
            break;
        case 'catalog.html':
            initCatalogPage();
            break;
        case 'book.html':
            initBookPage();
            break;
        case 'cart.html':
            initCartPage();
            break;
        case 'contacts.html':
            initContactsPage();
            break;
    }
}

function initHomePage() {
    // Загрузка новинок и бестселлеров
    // Новинки — определяем как последние добавленные книги
    const newBooks = BookManager.getLatestBooks(4);
    const bestsellers = BookManager.getTopRated(4);

    renderBooksGrid('new-books', newBooks);
    renderBooksGrid('bestseller-books', bestsellers);
}

function initCatalogPage() {
    // На странице каталога в разметке используется боковая панель фильтров
    // (нет html-формы с id="filter-form"), поэтому обрабатываем кнопки явно
    const applyFiltersBtn = document.getElementById('apply-filters');
    const resetFiltersBtn = document.getElementById('reset-filters');
    const sortSelect = document.getElementById('sort-select');
    const searchInput = document.getElementById('search-input');
    
    let currentBooks = BookManager.books;
    let pageSize = 9;
    let currentPage = 1;
    
    // Применение фильтров
    // Подключаем кнопки применения/сброса фильтров
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', function() {
            // при смене фильтров возвращаемся на страницу 1
            currentPage = 1;
            applyFilters();
        });
    }

    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', function() {
            // Сброс всех полей фильтра
                document.querySelectorAll('input[name="genre"]').forEach(i => i.checked = false);
                const max = document.getElementById('price-max');
                if (max) max.value = max.max || 5000;
            const author = document.getElementById('author-filter');
            if (author) author.value = '';
            currentPage = 1;
            applyFilters();
        });
    }
    
    // Сортировка
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            applyFilters();
        });
    }
    
    // Поиск
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function() {
            applyFilters();
        }, 300));
    }

    // Цена (single slider) — обновляем отображаемое значение и применяем фильтр при движении ползунка
    const priceRange = document.getElementById('price-max');
    const priceDisplay = document.getElementById('max-price');
    if (priceRange) {
        if (priceDisplay) priceDisplay.textContent = priceRange.value;
        priceRange.addEventListener('input', function() {
            if (priceDisplay) priceDisplay.textContent = this.value;
            // фильтруем в реальном времени
            applyFilters();
        });
    }
    
    function getCurrentFilters() {
        const genres = Array.from(document.querySelectorAll('input[name="genre"]:checked')).map(i => i.value);
        // We use a single slider for maximum price
        const maxPriceEl = document.getElementById('price-max');
        const authorEl = document.getElementById('author-filter');

        return {
            genre: genres,
            // minPrice — assume 0 (single slider controls maximum price)
            minPrice: 0,
            maxPrice: maxPriceEl ? Number(maxPriceEl.value) : null,
            author: authorEl ? (authorEl.value || '').trim() : ''
        };
    }

    function updatePagination() {
        const paginationContainer = document.getElementById('pagination');
        if (!paginationContainer) return;

        const totalPages = Math.max(1, Math.ceil(currentBooks.length / pageSize));
        // Если текущая страница выходит за пределы, корректируем
        if (currentPage > totalPages) currentPage = totalPages;

        const pages = [];
        for (let p = 1; p <= totalPages; p++) {
            pages.push(`<button class="page-btn" data-page="${p}" ${p===currentPage? 'aria-current="page"' : ''}>${p}</button>`);
        }

        paginationContainer.innerHTML = pages.join(' ');

        // Навешиваем обработчики страниц
        paginationContainer.querySelectorAll('.page-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const target = Number(this.dataset.page);
                if (!isNaN(target) && target !== currentPage) {
                    currentPage = target;
                    applyFilters();
                    // плавная прокрутка к началу каталога
                    document.getElementById('catalog-books')?.scrollIntoView({behavior: 'smooth'});
                }
            });
        });
    }

    function applyFilters() {
        const filters = getCurrentFilters();
        const searchQuery = searchInput ? searchInput.value : '';
        
        if (searchQuery) {
            currentBooks = BookManager.searchBooks(searchQuery);
        } else {
            currentBooks = BookManager.filterBooks(filters);
        }
        
        const sortBy = sortSelect ? sortSelect.value : 'name';
        currentBooks = BookManager.sortBooks(currentBooks, sortBy);
        
        // Пагинация: отображаем только текущую страницу
        const start = (currentPage - 1) * pageSize;
        const paginated = currentBooks.slice(start, start + pageSize);
        renderBooksGrid('catalog-books', paginated);
        updatePagination();
    }
    
    // Первоначальная загрузка
    applyFilters();
}

function initBookPage() {
    // Загрузка данных книги из URL параметров
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = parseInt(urlParams.get('id')) || 1;
    
    const book = BookManager.books.find(b => b.id === bookId);
    if (book) {
        renderBookDetails(book);
    }
    
    // Обработчики для добавления в корзину
    const addToCartBtn = document.getElementById('add-to-cart');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function() {
            const quantity = parseInt(document.getElementById('quantity').value) || 1;
            CartManager.addToCart(book, quantity);
        });
    }
}

function initCartPage() {
    renderCartItems();
    
    // Обработчики для обновления количества
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('quantity-btn')) {
            const itemId = parseInt(e.target.closest('.cart-item').dataset.id);
            const currentQty = parseInt(e.target.closest('.quantity-selector').querySelector('input').value);
            let newQty = currentQty;
            
            if (e.target.id === 'increase-qty') {
                newQty++;
            } else if (e.target.id === 'decrease-qty') {
                newQty = Math.max(1, newQty - 1);
            }
            
            CartManager.updateQuantity(itemId, newQty);
            renderCartItems();
        }
    });
    
    // Оформление заказа
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (CartManager.getTotalItems() === 0) {
                alert('Корзина пуста!');
                return;
            }
            
            if (confirm('Перейти к оформлению заказа?')) {
                // Здесь будет логика оформления заказа
                alert('Заказ успешно оформлен!');
                CartManager.clearCart();
                renderCartItems();
            }
        });
    }
}

function initContactsPage() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Валидация формы
            if (validateContactForm()) {
                // Отправка формы (заглушка)
                alert('Сообщение отправлено! Мы свяжемся с вами в ближайшее время.');
                contactForm.reset();
            }
        });
    }
}

// Вспомогательные функции
function renderBooksGrid(containerId, books) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = books.map(book => `
        <div class="book-card">
            <img src="${book.image}" alt="${book.title}" class="book-image">
            <h3 class="book-title">${book.title}</h3>
            <p class="book-author">${book.author}</p>
            <div class="book-price">
                <span class="current-price">${book.price} руб.</span>
                ${book.oldPrice ? `<span class="old-price">${book.oldPrice} руб.</span>` : ''}
            </div>
            <button class="btn-primary add-to-cart-btn" data-book-id="${book.id}">
                В корзину
            </button>
            <a href="book.html?id=${book.id}" class="btn-secondary" style="margin-top: 0.5rem; display: block;">
                Подробнее
            </a>
        </div>
    `).join('');
    
    // Добавляем обработчики для кнопок "В корзину"
    container.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const bookId = parseInt(this.dataset.bookId);
            const book = books.find(b => b.id === bookId);
            if (book) {
                CartManager.addToCart(book);
            }
        });
    });
}

function renderCartItems() {
    const container = document.getElementById('cart-items');
    const cart = CartManager.getCart();
    
    if (!container) return;
    
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart" id="empty-cart">
                <h2>Ваша корзина пуста</h2>
                <p>Добавьте товары из каталога</p>
                <a href="catalog.html" class="btn-primary">Перейти в каталог</a>
            </div>
        `;
    } else {
        container.innerHTML = cart.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.title}" class="cart-item-image">
                <div class="cart-item-details">
                    <h3>${item.title}</h3>
                    <p>${item.author}</p>
                    <div class="quantity-selector">
                        <button class="quantity-btn" id="decrease-qty">-</button>
                        <input type="number" value="${item.quantity}" min="1" max="10" readonly>
                        <button class="quantity-btn" id="increase-qty">+</button>
                    </div>
                    <div class="item-price">
                        ${item.price * item.quantity} руб.
                    </div>
                    <button class="btn-secondary remove-item" data-id="${item.id}">
                        Удалить
                    </button>
                </div>
            </div>
        `).join('');
        
        // Обработчики для удаления товаров
        container.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', function() {
                const itemId = parseInt(this.dataset.id);
                CartManager.removeFromCart(itemId);
                renderCartItems();
            });
        });
    }
    
    // Обновление итогов
    updateCartSummary();
}

function updateCartSummary() {
    const itemsCount = document.getElementById('items-count');
    const subtotal = document.getElementById('subtotal');
    const total = document.getElementById('total-cost');
    
    if (itemsCount) itemsCount.textContent = CartManager.getTotalItems();
    if (subtotal) subtotal.textContent = CartManager.getTotalPrice() + ' руб.';
    if (total) total.textContent = CartManager.getTotalPrice() + ' руб.';
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Рендер деталей книги на странице book.html
function renderBookDetails(book) {
    if (!book) return;

    const mainImage = document.getElementById('book-main-image');
    const titleEl = document.getElementById('book-title');
    const authorEl = document.getElementById('book-author');
    const priceEl = document.getElementById('book-price');
    const oldPriceEl = document.getElementById('book-old-price');
    const descEl = document.getElementById('book-description');
    const catEl = document.getElementById('book-category');
    const crumbEl = document.getElementById('book-title-crumb');

    if (mainImage) {
        mainImage.src = book.image || '';
        mainImage.alt = book.title || 'Обложка книги';
    }
    if (titleEl) titleEl.textContent = book.title || '';
    if (authorEl) authorEl.textContent = book.author || '';
    if (priceEl) priceEl.textContent = (book.price ? book.price + ' руб.' : '—');
    if (oldPriceEl) {
        if (book.oldPrice) {
            oldPriceEl.textContent = book.oldPrice + ' руб.';
            oldPriceEl.style.display = '';
        } else {
            oldPriceEl.style.display = 'none';
        }
    }
    if (descEl) descEl.textContent = book.description || '';
    if (catEl) catEl.textContent = book.category || '';
    if (crumbEl) crumbEl.textContent = book.title || '';

    // Похожие книги — рендер из той же категории (без текущей книги)
    const similar = BookManager.getBooksByCategory(book.category).filter(b => b.id !== book.id).slice(0, 6);
    renderBooksGrid('similar-books', similar);
}

// Простая валидация контактной формы
function validateContactForm() {
    const name = document.getElementById('contact-name');
    const email = document.getElementById('contact-email');
    const message = document.getElementById('contact-message');

    if (!name || !email || !message) return false;

    if (!name.value.trim()) {
        alert('Пожалуйста, введите имя.');
        name.focus();
        return false;
    }

    const emailVal = email.value.trim();
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailVal || !emailRe.test(emailVal)) {
        alert('Пожалуйста, введите корректный e-mail.');
        email.focus();
        return false;
    }

    if (!message.value.trim()) {
        alert('Пожалуйста, введите сообщение.');
        message.focus();
        return false;
    }

    return true;
}

// Экспорт для глобального использования
window.CartManager = CartManager;
window.BookManager = BookManager;   