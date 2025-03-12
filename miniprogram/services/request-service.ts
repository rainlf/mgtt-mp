interface RequestOptions {
    url: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    data?: any;
}

interface ApiResponse<T> {
    success: boolean;
    data: T;       // 业务数据（success为true时有效）
    code?: number; // 错误码（可选）
    message?: string; // 错误信息（可选）
}

export const server = 'http://localhost:8080'

export const request = <T>(options: RequestOptions): Promise<T> => {
    const fullUrl = options.url.startsWith('http')
        ? options.url
        : `${server}${options.url}`;

    return new Promise((resolve, reject) => {
        wx.request({
            ...options,
            url: fullUrl,
            success: (res) => {
                // 类型断言响应体符合 ApiResponse 结构
                const response = res.data as ApiResponse<T>;
                if (response.success) {
                    resolve(response.data);
                } else {
                    // 业务逻辑错误（如参数校验失败）
                    reject(response.message);
                }
            },
            fail: () => {
                // 网络层错误（如超时、断网）
                reject('网络连接失败');
            }
        });
    });
};

