<template>
    <div>
        <h1>자동완성UI 컴포넌트</h1>
        <!--<input type="text" v-model="keyword" placeholder="검색어를 입력하세요." @input="keyupKeyword($event.target.value)">-->
        <!--<ul id="suggest">-->
        <!--<li v-for="(item, index) of items" :key="index"></li>-->
        <!--</ul>-->
        <div class="search">
            <input type="text" placeholder="검색어를 입력하세요." id="keyword">
            <i class="fas fa-spinner" v-show="isLoading"></i>
        </div>
        <div class="suggest">
            <h2>총: {{totalUserCount}}명</h2>
            <table v-show="isExistUsers">
                <thead>
                <tr>
                    <th>id</th>
                    <th>name</th>
                    <th>profile image</th>
                </tr>
                </thead>
                <tr>
                </tr>
                <tr v-for="(item, index) of items" :key="index">
                    <td>{{item.id}}</td>
                    <td>{{item.login}}</td>
                    <td><img :src="item.avatar_url" class="profile-image"></td>
                </tr>
            </table>
        </div>
    </div>
</template>
<script>
import {partition, fromEvent} from 'rxjs';
import {tap, switchMap, pluck, distinctUntilChanged, debounceTime, share, retry, finalize} from 'rxjs/operators';
import {ajax} from 'rxjs/ajax';

export default {
    name: 'AutoComplete',
    data() {
        return {
            keyword: '',
            items: [],
            totalUserCount: 0,
            isLoading: false
        };
    },
    computed: {
        isExistUsers() {
            return this.items.length > 0;
        }
    },
    methods: {
        startLoad() {
            this.isLoading = true;
        },
        endLoad() {
            this.isLoading = false;
        },
        resetItems() {
            this.items = [];
            this.totalUserCount = 0;
        }
    },
    mounted() {
        const keyup$ = fromEvent(document.getElementById('keyword'), 'keyup').pipe(
            debounceTime(300),
            pluck('target', 'value'),
            distinctUntilChanged(),
            tap(v => console.log('from keyup$', v)),
            share()
        );
        let [users$, reset$] = partition(keyup$, (keyword) => keyword.trim().length > 0);
        users$ = users$.pipe(
            tap(this.startLoad),
            switchMap((keyword) => ajax.getJSON(`https://api.github.com/search/users?q=${keyword}`)),
            tap(this.endLoad),
            retry(2),
            finalize(this.endLoad),
            tap(v => console.log('from users$', v))
        );
        reset$ = reset$.pipe(
            tap(this.resetItems),
            tap(v => console.log('from reset$', v))
        );

        users$.subscribe((users) => {
            this.items = users.items;
            this.totalUserCount = users.total_count;
        }, (error) => {
            console.error(error);
            alert('다음에 다시 시도해 주세요.');
        });
        reset$.subscribe();
    }
};
</script>

<style scoped>
    .suggest table {
        margin: 0 auto;
    }

    .profile-image {
        width: 50px;
        height: 50px;
    }

    @keyframes rotating {
        from {
            transform: rotate(0deg)
        }
        to {
            transform: rotate(360deg)
        }
    }

    .search {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .fa-spinner {
        margin: 0 8px;
        animation: rotating 1s linear infinite;
    }
</style>